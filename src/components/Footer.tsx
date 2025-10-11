import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm">&copy; {new Date().getFullYear()} Números Mega Sena. Todos os direitos reservados.</p>
          </div>
          <div className="flex justify-center md:justify-end">
            <Link href="/" className="text-sm text-gray-400 hover:text-white mx-2">
              Página Inicial
            </Link>
            <Link href="/sobre" className="text-sm text-gray-400 hover:text-white mx-2">
              Sobre
            </Link>
            <Link href="/contato" className="text-sm text-gray-400 hover:text-white mx-2">
              Contato
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
