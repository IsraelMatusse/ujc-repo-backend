import { EmailSendDTO } from "#interfaces/request/user";
import axios from "axios";
export class NotificationService {
  async emailSender(data: EmailSendDTO) {
    try {
      await axios.post("", data);
    } catch (errror) {
      throw new Error("Erro ao enviar email");
    }
  }
}
