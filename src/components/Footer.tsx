import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { TrendingUp } from 'lucide-react';
const Footer = () => {
  return <footer className="bg-muted/50 border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center shadow-lottery">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">Resultados das principais loterias brasileiras, 
atualizados em tempo real. </span>
            </Link>
            
          </div>

          {/* Legal Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Aviso Legal</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Este é um site independente de resultados de loterias. Não possuímos vínculo com a Caixa Econômica Federal.</p>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Números Mega Sena. Todos os direitos reservados.
          </p>
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span>Jogue com responsabilidade</span>
            <span>•</span>
            <span>+18 anos</span>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;