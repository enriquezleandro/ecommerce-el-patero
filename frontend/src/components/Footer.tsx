import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="mb-4">
              <Logo width={220} height={60} className="w-[160px] md:w-[220px]" />
            </div>
            <p className="text-sm text-muted-foreground">
              Tu espacio de cultivo y estilo. Equipamiento profesional y moda urbana para cultivadores.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4">Contacto</h4>
            <div className="space-y-3">
              <a href="mailto:info@elpatero.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                <Mail className="w-4 h-4" />
                info@elpatero.com
              </a>
              <a href="tel:+541112345678" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                <Phone className="w-4 h-4" />
                +54 11 1234-5678
              </a>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Buenos Aires, Argentina</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  Envíos y Devoluciones
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  Preguntas Frecuentes
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-4">Síguenos</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Mantente al día con las últimas novedades y ofertas.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/elpaterogrowshop"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground p-2 rounded-lg transition-colors cursor-pointer"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground p-2 rounded-lg transition-colors cursor-pointer"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground p-2 rounded-lg transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} El Patero GrowShop. Todos los derechos reservados.</p>
          <p className="mt-2">
            🌿 Cultivo responsable - Solo para mayores de 18 años 🌿
          </p>
        </div>
      </div>
    </footer>
  );
}
