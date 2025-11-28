import { WebSocket } from "ws";
import { IWssMiddlewares } from "../middlewares/wss/IWssMiddlewares";
import { IRequest } from "../server/interfaces/IRequest";
import { IResponse } from "../server/interfaces/IResponse";
import { UsersService } from "../service/UsersService";
import { MiddlewareAdapter } from "../middlewares/https/HttpsMiddlewares";

export class UsersControllers {
  constructor(
    private UserService: UsersService,
    private middlewareHttps: MiddlewareAdapter // private _middlewareWss: IWssMiddlewares
  ) {
    this.start();
  }
  start() {
    this.middlewareHttps.registerRouter(
      "post",
      "/register",
      async (req, res) => {
        const { name } = req.body;

        if (name) {
          const user = await this.UserService.saveUser({
            name,
          });
          return res.status(201).json({ user });
        } else
          return res
            .status(401)
            .json({ message: "Bad request, name of user not found" });
      }
    );

    this.middlewareHttps.registerRouterFile(
      "post",
      "/files",
      async (req, res) => {
        // const { idMachine } = req.body;
        // res.json(req.file);
        // O corpo da requisição (Buffer binário comprimido) está em req.body
        const compressedChunk = req.body;

        // Metadados são lidos dos headers
        const fileName = req.get("X-File-Name");
        const isLengthLarge = req.get("X-Is-Large") === "true";
        const chunkEnd = req.get("X-Chunk-End") === "true";
        let idFile = req.get("X-Chunk-ID") || null;
        const idMachine = req.get("X-Machine-ID");

        if (!fileName || !compressedChunk || !idMachine) {
          return res.status(400).json({
            error: "Dados incompletos nos headers ou body.",
          });
        }
        const fileDatas = {
          type: "file",
          // idResponse,
          chunk: compressedChunk.toString("base64"), // WebSocket envia String, então Base64 é necessário AQUI
          fileName,
          isLengthLarge,
          end: chunkEnd,
          idFile,
        };
        await this.UserService.sendFileToMachine(
          compressedChunk,
          idMachine,
          fileDatas,
          res
        );

        // Para chunks subsequentes, a resposta é enviada por responseUser
      }
    );

    this.middlewareHttps.registerRouter("get", "/users", async (req, res) => {
      const users = await this.UserService.getAllUsers();
      return res.json({ users });
    });
    this.middlewareHttps.registerRouter(
      "post",
      "/machineCommand",
      async (req, res: IResponse) => {
        const { id } = req.headers;
        const { command, idMachine, response } = req.body;
        const test = await this.UserService.sendCommandOfMachine(
          id,
          idMachine,
          command,
          response ? res : null
        );
        if (test) res.json({ message: "command sended" });
      }
    );
  }

  private async sendFileToMachine(req: IRequest, res: IResponse) {}
}
