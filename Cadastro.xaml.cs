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
using System.Windows.Shapes;

namespace LoginExemplo
{
    // Classe da janela de cadastro
    public partial class Cadastro : Window
    {
        private void btnVoltar_Click(object sender, RoutedEventArgs e)
        {
            MainWindow telaMain = new MainWindow(usersTelaCadastro);    // Cria novamente a tela de login
            telaMain.Show();                                            // Mostra a tela de login
            this.Close();                                               // Fecha a tela de cadastro
        }
        // Lista que armazena os usuários cadastrados
        public List<Usuario> usersTelaCadastro = new List<Usuario>();

        // Construtor da tela de cadastro
        public Cadastro(List<Usuario> usersTelaLogin)
        {
            this.usersTelaCadastro = usersTelaLogin;                  // Recebe a lista da tela de login
            InitializeComponent();                                   // Inicializa componentes da interface
        }

        // Evento executado ao clicar no botão cadastrar
        private void btnCadastrar_Click(object sender, RoutedEventArgs e)
        {

            // Verifica se usuário ou senha estão vazios
            if (string.IsNullOrWhiteSpace(txtUserCad.Text) ||
                string.IsNullOrWhiteSpace(pswSenhaCad.Password))
            {
                MessageBox.Show("Preencha todos os campos!");
                return;
            }

            // Verifica se já existe usuário com o mesmo nome
            bool usuarioExiste = usersTelaCadastro.Any(u => u.User == txtUserCad.Text);

            // Se o usuário já existir
            if (usuarioExiste)
            {
                MessageBox.Show("Já existe um usuário com esse nome!", "Erro", MessageBoxButton.OK, MessageBoxImage.Warning); // Exibe mensagem de erro
                return; // Interrompe o método
            }

            // Cria um novo usuário com os dados digitados
            Usuario usercadastrando = new Usuario(txtUserCad.Text, pswSenhaCad.Password);

            // Adiciona o usuário na lista
            usersTelaCadastro.Add(usercadastrando);

            // Cria novamente a tela de login
            MainWindow telaLogin = new MainWindow(usersTelaCadastro);
            telaLogin.Show();                                           // Mostra a tela de login
            this.Close();                                               // Fecha a tela de cadastro
        }
    }
}