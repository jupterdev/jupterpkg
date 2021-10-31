import mongoose, { Schema } from "mongoose";
import { Client, Collection } from "discord.js";

interface jupterDBEvents {
  ready: (jupterDB: jupterDB) => unknown;
}

export class jupterDB {
  public schema = mongoose.model<jupterDBSchema>(
    "jupterdb-collection",
    new Schema({
      key: String,
      value: mongoose.SchemaTypes.Mixed,
    })
  );
  public dbCollection: Collection<string, any> = new Collection();
  public client: Client;

  /**
   * @name jupterDB
   * @kind construtor
   * @param {jupterDBOptions} options Opções para usar o banco de dados
   */

  constructor(mongooseConnectionString: string) {
    if (mongoose.connection.readyState !== 1) {
      if (!mongooseConnectionString)
        throw new Error(
          "Não há conexão estabelecida com mongoose, uma conexão com mongoose é necessária!"
        );

      mongoose.connect(mongooseConnectionString);
    }
    this.ready();
  }

  private async ready() {
    await this.schema.find({}).then((data) => {
      data.forEach(({ key, value }) => {
        this.dbCollection.set(key, value);
      });
    });
  }

  /**
   * @method
   * @param key  A chave, para que você possa obtê-lo <MongoClient>.get("key")
   * @param value valor o valor que será salvo na chave
   * @description Salva dados para MongoDB
   * @example <jupterDB>.set("test","js e bom")
   */
  public set(key: string, value: any) {
    if (!key || !value) return;
    this.schema.findOne({ key }, async (err, data) => {
      if (err) throw err;
      if (data) data.value = value;
      else data = new this.schema({ key, value });

      data.save();
      this.dbCollection.set(key, value);
    });
  }

  /**
   * @method
   * @param key Eles digitam que você deseja excluir
   * @description Remove dados do MongoDB
   * @example <jupterDB>.delete("teste")
   */
  public delete(key: string) {
    if (!key) return;
    this.schema.findOne({ key }, async (err, data) => {
      if (err) throw err;
      if (data) await data.delete();
    });
    this.dbCollection.delete(key);
  }

  /**
   * @method
   * @param key A chave que você deseja obter dados
   * @description Obtém dados do banco de dados com uma chave
   * @example <jupterDB>.get('key1')
   */
  public get(key: string): any {
    if (!key) return;
    return this.dbCollection.get(key);
  }

  /**
   * @method
   * @param key A chave que você deseja enviar dados para
   * @description Empurre os dados para uma matriz com uma tecla
   * @example
   */
  public push(key: string, ...pushValue: any) {
    const data = this.dbCollection.get(key);
    const values = pushValue.flat();
    if (!Array.isArray(data))
      throw Error(`Você não pode puxar dados para um valor ${typeof data}!`);

    data.push(pushValue);
    this.schema.findOne({ key }, async (err, res) => {
      res.value = [...res.value, ...values];
      res.save();
    });
  }

  /**
   * @method
   * @returns Dados em cache com a coleção de discórdia.js
   */
  public collection(): Collection<string, any> {
    return this.dbCollection;
  }
}

export interface reconDBSchema {
  key: string;
  value: any;
}
