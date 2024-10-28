const SqlServices = require("../services/sql-services");

/**
 * Classe que representa uma Tarefa com seus atributos e métodos relacionados.
 * @author Luan Vinicius
 */
class Tarefa {
  /**
   * Construtor da classe Tarefa.
   * @param {number} id - ID da tarefa.
   * @param {string} titulo - Título da tarefa.
   * @param {string} descricao - Descrição da tarefa.
   * @param {string} prioridade - Prioridade da tarefa.
   * @param {string} categoria - Categoria da tarefa.
   * @param {string} dataCriacao - Data em que a tarefa foi criada.
   * @param {string} dataConclusao - Data de conclusão da tarefa (se concluída).
   */
  constructor(
    id,
    titulo,
    descricao,
    prioridade,
    categoria,
    dataCriacao,
    dataConclusao
  ) {
    this.id = id;
    this.titulo = titulo;
    this.descricao = descricao;
    this.prioridade = prioridade;
    this.categoria = categoria;
    this.dataCriacao = dataCriacao;
    this.dataConclusao = dataConclusao;
  }

  /**
   * Cria uma instância de Tarefa a partir de um registro SQL.
   * @param {Object} linhaDeRetornoSql - Objeto contendo os dados da linha do banco de dados.
   * @returns {Tarefa} Uma nova instância de Tarefa.
   */
  static criarUsandoSql(linhaDeRetornoSql) {
    return new Tarefa(
      linhaDeRetornoSql.id,
      linhaDeRetornoSql.titulo,
      linhaDeRetornoSql.descricao,
      linhaDeRetornoSql.prioridade,
      linhaDeRetornoSql.categoria,
      linhaDeRetornoSql.dataCriacao,
      linhaDeRetornoSql.dataConclusao
    );
  }

  /**
   * Cadastra uma nova tarefa no banco de dados.
   * @param {string} titulo - Título da tarefa.
   * @param {string} descricao - Descrição da tarefa.
   * @param {string} prioridade - Prioridade da tarefa.
   * @param {string} categoria - Categoria da tarefa.
   * @returns {boolean} True se a tarefa foi cadastrada com sucesso, False caso contrário.
   */
  static async cadastrar(idUsuario, titulo, descricao, prioridade, categoria) {
    const RetornoDoCadastro =
      await SqlServices.executar`INSERT INTO ${process.env.DB_ESQUEMA}.${process.env.DB_TBL_TAREFAS} ("idUsuario", "titulo", "descricao", "prioridade", categoria) 
                VALUES('${idUsuario}', '${titulo}', '${descricao}', '${prioridade}', '${categoria}');`;
    return RetornoDoCadastro.rowCount > 0;
  }

  /**
   * Consulta uma tarefa específica no banco de dados pelo ID.
   * @param {number} id - ID da tarefa a ser consultada.
   * @returns {Tarefa|null} A tarefa encontrada ou null, se não existir.
   */
  static async consultar(id, idUsuario) {
    const resultado = await SqlServices.executar(`
            SELECT * FROM ${process.env.DB_ESQUEMA}.${process.env.DB_TBL_TAREFAS} 
            WHERE "id" = ${id} AND "idUsuario" = ${idUsuario}`);
    const linha = resultado.rows[0];
    return linha ? Tarefa.criarUsandoSql(linha) : null;
  }

  /**
   * Lista todas as tarefas do banco de dados.
   * @returns {Tarefa[]} Um array com todas as tarefas encontradas.
   */
  static async listar(idUsuario) {
    const resultado = await SqlServices.executar(
      `SELECT * FROM ${process.env.DB_ESQUEMA}.${process.env.DB_TBL_TAREFAS} 
            WHERE "idUsuario" = ${idUsuario}`
    );
    return resultado.rows.map(Tarefa.criarUsandoSql);
  }

  /**
   * Atualiza uma tarefa existente no banco de dados.
   * @param {number} id - ID da tarefa a ser atualizada.
   * @param {string} titulo - Novo título da tarefa.
   * @param {string} descricao - Nova descrição da tarefa.
   * @param {string} prioridade - Nova prioridade da tarefa.
   * @param {string} categoria - Nova categoria da tarefa.
   * @returns {boolean} True se a tarefa foi atualizada, False caso contrário.
   */
  static async atualizar(
    id,
    idUsuario,
    titulo,
    descricao,
    prioridade,
    categoria
  ) {
    const ComandoAtualizar = `
        UPDATE ${process.env.DB_ESQUEMA}.${process.env.DB_TBL_TAREFAS}
        SET titulo = ${titulo}, descricao = ${descricao}, prioridade = ${prioridade}, categoria = ${categoria}
        WHERE id = ${id} AND "idUsuario" = ${idUsuario};
    `;
    const resultado = await SqlServices.executar(ComandoAtualizar);
    return resultado.rowCount > 0;
  }

  /**
 * Remove uma tarefa do banco de dados pelo ID e ID do usuário.
 * @param {number} id - ID da tarefa a ser removida.
 * @param {number} idUsuario - ID do usuário que possui a tarefa.
 * @returns {boolean} True se a tarefa foi removida, False caso contrário.
 */
  static async remover(id, idUsuario) {
    const ComandoRemover = `DELETE FROM ${process.env.DB_ESQUEMA}.${process.env.DB_TBL_TAREFAS}
        WHERE id = ${id} AND "idUsuario" = ${idUsuario}`;
    const resultado = await SqlServices.executar(ComandoRemover);
    return resultado.rowCount > 0;
  }
}
module.exports = Tarefa;
