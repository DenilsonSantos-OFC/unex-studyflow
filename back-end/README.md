--------------------------------------------------------
PLANEJAMENTO DE ROTAS
--------------------------------------------------------

POST	/autenticar		- faz o processo de validação e autenticação do usuário, verificando se as credenciais batem com os dados armazenados no banco de dados (autenticar)
POST	/cadastrar 		- cria um novo usuário no banco de dados utilizando os dados passados pela requisição (cadastrar)


PERFIL (PRÓPRIO USUÁRIO)
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
GET	    /perfil		- obtém todas as informações do usuário em questão a partir do banco de dados (consultar)
PUT	    /perfil 	- atualiza as informações de um usuário no banco de dados utilizando os dados passados pela requisição (alterar)


TAREFA
------------------------------------------------------------------------------------------------------------------------
GET	    /tarefas		- acessa as informações de todas as tarefas do usuário (buscarTarefas)
GET	    /tarefa/:id		- acessa as informações de uma tarefa específica do usuário (buscarTarefa)
POST	/tarefa			- cria uma nova tarefa utilizando os dados enviados pela requisição (cadastrar)
PUT	    /tarefa/:id		- atualiza as informações de uma tarefa utilizando os novos dados enviados pela requisição (alterar)
DELETE	/tarefa/:id		- deleta uma tarefa do usuário do banco de dados (excluir)