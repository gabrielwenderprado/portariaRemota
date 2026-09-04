using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoginExemplo
{
    public class Usuario
    {
        private String user;                            // Atributos que cada usuário possui
        private String senha;
        private String cpf;

        public Usuario(String user, String senha)       // Construtor sem o atributo cpf devido a não vínculo com o banco
        {
            this.user = user;                           // this se refere ao atributo da classe 
            this.senha = senha;
        }

        public String User { get { return user; } set { user = value; } } // Método que retorna o nome do usuário
        public String Senha { get {  return senha; } }   // Propriedade de somente leitura da senha
    }
}
