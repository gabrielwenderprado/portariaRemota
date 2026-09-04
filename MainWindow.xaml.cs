using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace LoginExemplo
{
    // Classe da janela principal do sistema
    public partial class MainWindow : Window
    {
        // Lista que armazena os usuários do sistema
        public List<Usuario> users = new List<Usuario>();

        // Construtor padrão
        public MainWindow()
        {
            InitializeComponent();                             // Inicializa componentes da interface
        }

        // Construtor que recebe lista de usuários
        public MainWindow(List<Usuario> usersTelaCadastro)
        {
            this.users = usersTelaCadastro;                     // Recebe a lista atualizada
            InitializeComponent();
        }

        // Evento executado quando a janela carrega
        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            // Evita duplicar usuários
            if (users.Count == 0)
            {
                Usuario user1 = new Usuario("cpmg", "cpmg2025");    //cria um novo usuário
                users.Add(user1);
            }
        }

        // Evento do botão de login
        private void btnLogar_Click(object sender, RoutedEventArgs e)
        {
            // Cria objeto com os dados digitados
            Usuario userlogando = new Usuario(txtUser.Text, pswSenha.Password);

            bool usuarioExiste = false;                     // Verifica se usuário existe
            bool senhaCorreta = false;                      // Verifica se senha está correta

            // Percorre lista de usuários
            foreach (Usuario usuario in users)
            {
                // Verifica se o usuário existe
                if (userlogando.User == usuario.User)
                {
                    usuarioExiste = true;

                    // Verifica se a senha está correta
                    if (userlogando.Senha == usuario.Senha)
                    {
                        senhaCorreta = true;
                    }

                    break; // Encerra o loop
                }
            }

            // Usuário e senha corretos
            if (usuarioExiste && senhaCorreta)
            {
                MessageBox.Show("Acesso Liberado!");
            }

            // Usuário não existe e senha vazia
            else if (!usuarioExiste && string.IsNullOrEmpty(userlogando.Senha))
            {
                MessageBox.Show("Usuário e senha inválidos!");
            }

            // Usuário inválido
            else if (!usuarioExiste)
            {
                MessageBox.Show("Login inválido!");
            }

            // Senha incorreta
            else if (!senhaCorreta)
            {
                MessageBox.Show("Senha inválida!");
            }
        }

        // Evento do botão cadastrar
        private void btnCadastrar_Click(object sender, RoutedEventArgs e)
        {
            Cadastro telaCadastro = new Cadastro(users);             // Cria tela de cadastro
            telaCadastro.Show();                                     // Mostra tela de cadastro
            this.Close();                                            // Fecha tela atual
        }

        // Evento do botão remover usuário
        private void btnRemoverUsuario_Click(object sender, RoutedEventArgs e)
        {
            RemoverUsuario tela = new RemoverUsuario(users);        // Cria tela de remoção
            tela.Show();                                            // Mostra tela de remoção
            this.Close();                                           // Fecha tela atual
        }
    }
}
