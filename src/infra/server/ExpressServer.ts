import express, { Express, NextFunction, Request, Response } from "express";
import { IServer, methodHTTP } from "./interfaces/IServer";
import { IMiddlewareHandler } from "./interfaces/IMiddlewareHandler";
// Observação: Assumindo que IRequest foi atualizado para incluir a propriedade 'file'
import { IRequest } from "./interfaces/IRequest";
import { IResponse } from "./interfaces/IResponse";
import multer, { Multer } from "multer";

export class ServerExpress implements IServer {
  private app: Express;
  private multer: Multer;

  constructor() {
    // Configuração do Multer
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        // Importante: O Multer irá criar req.file depois de salvar.
        // Aqui, apenas fornecemos o caminho de destino.
        cb(null, process.cwd() + "\\uploads");
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname);
      },
    });

    this.multer = multer({ storage });
    this.app = express();
    this.app.use(express.json({ limit: "300mb" }));
    this.app.use(
      express.raw({
        type: "application/octet-stream",
        limit: "200mb",
      })
    );
  }

  private wrapHandler(
    handler: IMiddlewareHandler
  ): (
    expressReq: Request,
    expressRes: Response,
    expressNext: NextFunction
  ) => void {
    return async (
      expressReq: Request,
      expressRes: Response,
      expressNext: NextFunction
    ) => {
      // O Multer anexa 'file' (para single) ou 'files' (para array/fields) ao expressReq.
      // Aqui, estendemos o IRequest para incluir essa informação, se existir.
      const ireq: IRequest = {
        body: expressReq.body,
        params: expressReq.params,
        query: expressReq.query,
        headers: expressReq.headers,
        method: expressReq.method,
        path: expressReq.path,
        get: expressReq.get,
        // **A SOLUÇÃO:** Adicionando req.file (se existir) ao IRequest customizado
        file: (expressReq as any).file, // 'as any' é usado para acessar propriedades não tipadas pelo Express padrão
      };

      const ires: IResponse = {
        status: (code: number) => {
          expressRes.status(code);
          return ires;
        },
        json: (data: any) => expressRes.json(data),
        send: (data: any) => expressRes.send(data),
      };

      const next = (err?: any) => {
        if (err) {
          return expressNext(err);
        }
        expressNext();
      };

      try {
        await handler(ireq, ires, next);
      } catch (error) {
        console.error("Erro capturado no handler do usuário:", error);
        if (!expressRes.headersSent) {
          ires.status((error as any).status || 500).json({
            message:
              (error as any).message ||
              "Erro interno do servidor durante a execução do handler.",
          });
        } else {
          console.error("Erro capturado após headers enviados:", error);
        }
      }
    };
  }

  public registerRouter(
    methodHTTP: methodHTTP,
    path: string,
    ...handlers: IMiddlewareHandler[]
  ) {
    const expressHandlers = handlers.map((handler) =>
      this.wrapHandler(handler)
    );
    console.log(` Rota registrada: ${methodHTTP.toUpperCase()} ${path}`);
    return this.app[methodHTTP](path, ...expressHandlers);
  }

  public registerRouterFile(
    methodHTTP: methodHTTP,
    path: string,
    ...handlers: IMiddlewareHandler[]
  ) {
    const multerMiddleware = this.multer.single("file");

    const wrappedHandlers = handlers.map((handler) =>
      this.wrapHandler(handler)
    );

    console.log(
      ` Rota de arquivo registrada: ${methodHTTP.toUpperCase()} ${path}`
    );

    // A ordem é importante: Multer executa primeiro, anexa req.file.
    // O wrapHandler executa em seguida e copia o req.file para ireq.
    return this.app[methodHTTP](path, multerMiddleware, ...wrappedHandlers);
  }

  public listen(port: number) {
    return this.app.listen(port, () =>
      console.log("rodando servidor: \n" + `http://localhost:${port}/`)
    );
  }
}
