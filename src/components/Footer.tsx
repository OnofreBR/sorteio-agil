import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, Shield, FileText, Info } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center shadow-lottery">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">Números Mega Sena</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Seu portal oficial para acompanhar os resultados das principais loterias brasileiras. 
              Informações atualizadas e confiáveis.
            </p>
          </div>

          {/* Loterias */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Loterias</h3>
            <div className="space-y-2">
              {[
                'Mega-Sena',
                'Quina',
                'Lotofácil',
                'Lotomania',
                'Dupla Sena',
                'Federal'
              ].map((lottery) => (
                <Button 
                  key={lottery}
                  variant="ghost" 
                  size="sm"
                  className="justify-start p-0 h-auto text-muted-foreground hover:text-foreground transition-smooth"
                >
                  {lottery}
                </Button>
              ))}
            </div>
          </div>

          {/* Links Úteis */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Informações</h3>
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="justify-start p-0 h-auto text-muted-foreground hover:text-foreground transition-smooth"
              >
                <Info className="w-4 h-4 mr-2" />
                Como Jogar
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="justify-start p-0 h-auto text-muted-foreground hover:text-foreground transition-smooth"
              >
                <Shield className="w-4 h-4 mr-2" />
                Sobre Nós
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="justify-start p-0 h-auto text-muted-foreground hover:text-foreground transition-smooth"
              >
                <FileText className="w-4 h-4 mr-2" />
                Contato
              </Button>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Aviso Legal</h3>
            <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              <p>
                Este site não é afiliado à Caixa Econômica Federal. 
                Os resultados são informativos e não substituem a consulta oficial.
              </p>
              <Button 
                variant="ghost" 
                size="sm"
                className="justify-start p-0 h-auto text-muted-foreground hover:text-foreground transition-smooth"
              >
                <FileText className="w-3 h-3 mr-1" />
                Termos de Uso
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="justify-start p-0 h-auto text-muted-foreground hover:text-foreground transition-smooth"
              >
                <Shield className="w-3 h-3 mr-1" />
                Privacidade
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Números Mega Sena. Todos os direitos reservados.
          </p>
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span>Jogue com responsabilidade</span>
            <span>•</span>
            <span>+18 anos</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;