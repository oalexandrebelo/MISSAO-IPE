// CLI opcional fixada: prisma@7.10.1. Caminhos relativos a este arquivo.
// Sem dotenv, credenciais, geração de client ou conexão do app ao banco.
export default {
  schema: './schema.prisma',
  migrations: { path: './migrations' },
  datasource: { url: 'file:./mission-local.db' },
};
