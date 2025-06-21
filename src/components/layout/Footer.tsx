import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Shield, FileText } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <span className="text-xl font-heading font-bold">Sabor & Vida</span>
            </div>
            <p className="text-neutral-300 max-w-md mb-6">
              Transformando a vida de diabéticos através de receitas deliciosas, 
              planejamento nutricional inteligente e educação alimentar de qualidade.
            </p>
            <div className="flex items-center space-x-2 text-sm text-neutral-400">
              <Shield className="w-4 h-4" />
              <span>Seus dados estão seguros conosco</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Plataforma</h3>
            <ul className="space-y-2 text-neutral-300">
              <li><Link to="/recipes" className="hover:text-primary-400">Receitas</Link></li>
              <li><Link to="/meal-plans" className="hover:text-primary-400">Planos Alimentares</Link></li>
              <li><Link to="/education" className="hover:text-primary-400">Educação</Link></li>
              <li><Link to="/pricing" className="hover:text-primary-400">Preços</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-neutral-300">
              <li><Link to="/privacy" className="hover:text-primary-400">Privacidade</Link></li>
              <li><Link to="/terms" className="hover:text-primary-400">Termos de Uso</Link></li>
              <li><Link to="/cookies" className="hover:text-primary-400">Cookies</Link></li>
              <li>
                <a href="mailto:contato@saborevida.com" className="hover:text-primary-400 flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  Contato
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm">
            © 2024 Sabor & Vida. Todos os direitos reservados.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2 text-sm text-neutral-400">
              <FileText className="w-4 h-4" />
              <span>LGPD Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
