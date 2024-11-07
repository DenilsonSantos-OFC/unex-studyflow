const SqlServices = require("../services/sql-services");
  
/**
 * @class Tarefa
 * @file tarefa.js
 * @author Luan Vinicius
 * @classdesc Esta classe representa uma tarefa dentro do sistema e lida com operações de cadastro, atualização, consulta e remoção de tarefas.
 * @description
 * A classe Tarefa interage diretamente com o banco de dados, permitindo a criação, consulta, atualização, remoção e marcação de tarefas como concluídas.
 * Cada tarefa está associada a um usuário, e as operações realizadas afetam o banco de dados diretamente.
 * A classe utiliza o SqlServices para a execução das consultas SQL.
 */
class Tarefa {
  /**
   * Construtor da classe Tarefa.
   * @constructor
   * @param {number} id - ID da tarefa.
   * @param {number} idUsuario - ID do usuário responsável pela tarefa.
   * @param {string} titulo - Título da tarefa.
   * @param {string} descricao - Descrição da tarefa.
   * @param {string} prioridade - Prioridade da tarefa.
   * @param {string} categoria - Categoria da tarefa.
   * @param {string} dataCriacao - Data em que a tarefa foi criada.
   * @param {string} dataConclusao - Data de conclusão da tarefa (se concluída).
   */
  constructor(
    id,
    idUsuario,
    titulo,
    descricao,
    prioridade,
    categoria,
    dataCriacao,
    dataConclusao
  ) {
    this.id = id;
    this.idUsuario = idUsuario
    this.titulo = titulo;
    this.descricao = descricao;
    this.prioridade = prioridade;
    this.categoria = categoria;
    this.dataCriacao = dataCriacao;
    this.dataConclusao = dataConclusao;
  }

  /**
   * Cria uma instância de Tarefa a partir de um registro SQL.
   * @static
   * @param {Object} linhaDeRetornoSql - Objeto contendo os dados da linha do banco de dados.
   * @returns {Tarefa} Uma nova instância de Tarefa.
   */
  static criarUsandoSql(linhaDeRetornoSql) {
    return new Tarefa(
      linhaDeRetornoSql.id,
      linhaDeRetornoSql.idUsuario,
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
   * @static @async
   * @param {number} idUsuario - ID do usuário responsável pela tarefa.
   * @param {string} titulo - Título da tarefa.
   * @param {string} descricao - Descrição da tarefa.
   * @param {string} prioridadeNv - Prioridade da tarefa.
   * @param {string} categoriaNv - Categoria da tarefa.
   * @returns {boolean} True se a tarefa foi cadastrada com sucesso, False caso contrário.
   * @throws {Error} Se ocorrer um erro durante a execução da consulta no banco de dados.
   */
  static async cadastrar(
    idUsuario, titulo, descricao, prioridadeNv, categoriaNv) {
    // Aqui você pode adicionar um console.log para a construção da SQL também
    const comandoSql = `INSERT INTO ${process.env.DB_ESQUEMA}.${process.env.DB_TBL_TAREFAS} ("idUsuario", "titulo", "descricao", "prioridadeNv", "categoriaNv") 
                        VALUES (${idUsuario}, '${titulo}', '${descricao}', ${prioridadeNv}, ${categoriaNv});`;
    const RetornoDoCadastro = await SqlServices.executar(comandoSql);
    return RetornoDoCadastro.rowCount > 0;
  }

  /**
   * Consulta uma tarefa específica no banco de dados pelo ID.
   * @static @async
   * @param {number} idUsuario - ID do usuário responsável pela tarefa.
   * @param {number} id - ID da tarefa a ser consultada.
   * @returns {Tarefa|null} A tarefa encontrada ou null, se não existir.
   * @throws {Error} Se ocorrer um erro durante a execução da consulta no banco de dados.
   */
  static async consultar(idUsuario, id) {
    const comandoSql = `SELECT * FROM ${process.env.DB_ESQUEMA}.${process.env.DB_TBL_TAREFAS} 
            WHERE "idUsuario" = ${idUsuario} AND "id" = ${id}`;
    const { rows } = await SqlServices.executar(comandoSql);
    return rows;
  }

  /**
   * Lista todas as tarefas do banco de dados para um usuário específico.
   * @static @async
   * @param {number} idUsuario - ID do usuário cujas tarefas serão listadas.
   * @returns {Tarefa[]} Um array com todas as tarefas encontradas para o usuário.
   * @throws {Error} Se ocorrer um erro durante a execução da consulta no banco de dados.
   */
  static async listar(idUsuario) {
    const comandoSql = `SELECT * FROM ${process.env.DB_ESQUEMA}.${process.env.DB_TBL_TAREFAS} 
            WHERE "idUsuario" = ${idUsuario}`;
    const { rows } = await SqlServices.executar(comandoSql, [idUsuario]);
    return rows;
  }

    /**
   * Lista todas as tarefas de um usuário com filtros de título e descrição.
   * @static @async
   * @param {number} idUsuario - ID do usuário cujas tarefas serão listadas.
   * @param {string} titulo - Título para filtro (opcional).
   * @param {string} descricao - Descrição para filtro (opcional).
   * @returns {Tarefa[]} Um array com todas as tarefas filtradas.
   * @throws {Error} Se ocorrer um erro durante a execução da consulta no banco de dados.
   */
  static async listarPorFiltro (idUsuario, titulo = '', descricao = ''){
    const comandoSql = `SELECT * FROM ${process.env.DB_ESQUEMA}.${process.env.DB_TBL_TAREFAS}
        WHERE "idUsuario" = ${idUsuario} AND 
        (('${titulo}' != '' AND "titulo" ILIKE '%' || '${titulo}' || '%') 
            OR 
        ('${descricao}' != '' AND "descricao" ILIKE '%' || '${descricao}' || '%'))`
    const {rows} = await SqlServices.executar(comandoSql, [idUsuario, titulo, descricao]);
    return rows;
  }

   /**
   * Atualiza uma tarefa existente no banco de dados.
   * @static @async
   * @param {number} idUsuario - ID do usuário responsável pela tarefa.
   * @param {number} id - ID da tarefa a ser atualizada.
   * @param {string} titulo - Novo título da tarefa.
   * @param {string} descricao - Nova descrição da tarefa.
   * @param {string} prioridadeNv - Nova prioridade da tarefa.
   * @param {string} categoriaNv - Nova categoria da tarefa.
   * @returns {boolean} True se a tarefa foi atualizada, False caso contrário.
   * @throws {Error} Se ocorrer um erro durante a execução da consulta no banco de dados.
   */
  static async atualizar(idUsuario, id, titulo, descricao, prioridadeNv, categoriaNv) {
    const ComandoAtualizar = `UPDATE ${process.env.DB_ESQUEMA}.${process.env.DB_TBL_TAREFAS}
      SET "titulo" = '${titulo}', "descricao" = '${descricao}', "prioridadeNv" = ${prioridadeNv}, "categoriaNv" = ${categoriaNv}
      WHERE "idUsuario" = ${idUsuario} AND "id" = ${id};`;
    const resultado = await SqlServices.executar(ComandoAtualizar);
    return resultado.rowCount > 0;
  }

  /**
   * Remove uma tarefa do banco de dados pelo ID e ID do usuário.
   * @static @async
   * @param {number} idUsuario - ID do usuário responsável pela tarefa.
   * @param {number} id - ID da tarefa a ser removida.
   * @returns {boolean} True se a tarefa foi removida, False caso contrário.
   * @throws {Error} Se ocorrer um erro durante a execução da consulta no banco de dados.
   */
  static async remover(idUsuario, id) {
    const ComandoRemover = `DELETE FROM ${process.env.DB_ESQUEMA}.${process.env.DB_TBL_TAREFAS}
        WHERE "idUsuario" = ${idUsuario} AND "id" = ${id}`;
    const resultado = await SqlServices.executar(ComandoRemover);
    return resultado.rowCount > 0;
  }

  /**
   * Marca a tarefa como concluída no banco de dados.
   * @static @async
   * @param {number} idUsuario - ID do usuário responsável pela tarefa.
   * @param {number} id - ID da tarefa a ser concluída.
   * @returns {boolean} True se a tarefa foi marcada como concluída com sucesso, False caso contrário.
   * @throws {Error} Se ocorrer um erro durante a execução da consulta no banco de dados.
   */
  static async concluir(idUsuario, id) {
    const comandoSql = `
        UPDATE ${process.env.DB_ESQUEMA}.${process.env.DB_TBL_TAREFAS}
        SET "horarioDeConclusao" = NOW() AT TIME ZONE 'America/Sao_Paulo'
        WHERE "idUsuario" = ${idUsuario} and ${id}`
    const resultado = await SqlServices.executar(comandoSql);
    return resultado.rowCount > 0;
  }
}
module.exports = Tarefa;