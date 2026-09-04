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
    // Classe da janela de remover usuários
    public partial class RemoverUsuario : Window
    {
        // Evento do botão voltar
        private void btnVoltar_Click(object sender, RoutedEventArgs e)
        {
            MainWindow telaMain = new MainWindow(usersRemover); // Cria novamente a MainWindow
            telaMain.Show();                                    // Mostra a MainWindow
            this.Close();                                       // Fecha a tela atual
        }

        // Lista de usuários recebida da MainWindow
        public List<Usuario> usersRemover = new List<Usuario>();

        // Construtor da tela
        public RemoverUsuario(List<Usuario> users)
        {
            InitializeComponent();                  // Inicializa componentes da interface

            usersRemover = users;                   // Recebe lista de usuários

            // Adiciona os nomes dos usuários na ListBox
            foreach (Usuario usuario in usersRemover)
            {
                lstUsuarios.Items.Add(usuario.User);
            }
        }

        // Evento do botão remover
        private void btnRemover_Click(object sender, RoutedEventArgs e)
        {
            // Verifica se existe item selecionado
            if (lstUsuarios.SelectedItem != null)
            {
                // Armazena o nome selecionado
                string nomeSelecionado = lstUsuarios.SelectedItem.ToString();

                Usuario usuarioRemover = null;                     // Variável que guardará o usuário encontrado

                // Procura o usuário na lista
                foreach (Usuario usuario in usersRemover)
                {
                    if (usuario.User == nomeSelecionado)
                    {
                        usuarioRemover = usuario;               // Guarda usuário encontrado
                        break;                                  // Encerra o loop
                    }
                }

                // Verifica se encontrou usuário
                if (usuarioRemover != null)
                {
                    usersRemover.Remove(usuarioRemover);        // Remove usuário da lista

                    lstUsuarios.Items.Remove(nomeSelecionado); // Remove usuário da ListBox

                    MessageBox.Show("Usuário removido!");       // Exibe mensagem
                }
            }
            else
            {
                MessageBox.Show("Selecione um usuário!");       // Exibe aviso se nada for selecionado
            }
        }
    }
}