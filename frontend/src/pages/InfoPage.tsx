import React from 'react';
import { BookOpen, Video, FileText, Lightbulb, PlayCircle, HelpCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

interface InfoPageProps {
  onNavigate: (page: string) => void;
}

export function InfoPage({ onNavigate }: InfoPageProps) {
  const guides = [
    {
      id: 1,
      title: 'Guía Completa para Principiantes',
      description: 'Todo lo que necesitas saber para empezar tu cultivo desde cero',
      category: 'Básico',
      image: 'https://images.unsplash.com/photo-1536505935294-3acc42ccd0b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      id: 2,
      title: 'Iluminación LED vs HPS',
      description: 'Comparativa completa de sistemas de iluminación para cultivo indoor',
      category: 'Intermedio',
      image: 'https://images.unsplash.com/photo-1681313409698-dbe22c68cfce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      id: 3,
      title: 'Control de pH y EC',
      description: 'Aprende a mantener los niveles óptimos de nutrientes',
      category: 'Intermedio',
      image: 'https://images.unsplash.com/photo-1676083826533-1997f6a8dc28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      id: 4,
      title: 'Técnicas de Entrenamiento (LST, HST)',
      description: 'Maximiza tu producción con estas técnicas avanzadas',
      category: 'Avanzado',
      image: 'https://images.unsplash.com/photo-1697813769280-0b46901aabb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
  ];

  const videos = [
    {
      id: 1,
      title: 'Como armar tu indoor paso a paso',
      duration: '15:30',
      views: '45K',
      thumbnail: 'https://images.unsplash.com/photo-1536505935294-3acc42ccd0b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      id: 2,
      title: 'Transplante: Cuando y Como hacerlo',
      duration: '10:45',
      views: '32K',
      thumbnail: 'https://images.unsplash.com/photo-1697813769280-0b46901aabb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      id: 3,
      title: 'Identificar y resolver problemas comunes',
      duration: '20:15',
      views: '67K',
      thumbnail: 'https://images.unsplash.com/photo-1672093192918-ac2d4c6e0500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
  ];

  const articles = [
    {
      id: 1,
      title: 'Los mejores sustratos para cultivo indoor',
      date: '2024-10-25',
      readTime: '5 min',
      image: 'https://images.unsplash.com/photo-1676083826533-1997f6a8dc28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      id: 2,
      title: 'Calendario de cultivo: temporada 2024',
      date: '2024-10-20',
      readTime: '8 min',
      image: 'https://images.unsplash.com/photo-1536505935294-3acc42ccd0b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      id: 3,
      title: 'Fertilizantes orgánicos vs minerales',
      date: '2024-10-15',
      readTime: '6 min',
      image: 'https://images.unsplash.com/photo-1681313409698-dbe22c68cfce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
  ];

  const faqs = [
    {
      id: 1,
      question: '¿Cuánta luz necesito para mi cultivo?',
      answer: 'Depende del tamaño de tu espacio, pero generalmente se recomienda 30-50W por pie cuadrado para LEDs de calidad. Para una carpa de 1m² (aproximadamente 10 pies cuadrados), necesitarías entre 300-500W de LED de buena calidad.',
    },
    {
      id: 2,
      question: '¿Con qué frecuencia debo regar?',
      answer: 'No hay una regla fija. Riega cuando la tierra esté seca a 2-3cm de profundidad. La frecuencia varía según el tamaño de la planta y la maceta. En general, las plantas pequeñas en macetas grandes necesitan menos agua que plantas grandes en macetas pequeñas.',
    },
    {
      id: 3,
      question: '¿Es necesario controlar el pH?',
      answer: 'Sí, es fundamental. El rango ideal es 6.0-7.0 en tierra y 5.5-6.5 en hidro. Un pH incorrecto impide que la planta absorba nutrientes correctamente, incluso si están presentes en la solución nutritiva.',
    },
    {
      id: 4,
      question: '¿Qué temperatura es ideal para el cultivo?',
      answer: 'La temperatura ideal durante el día es de 20-28°C, y durante la noche de 18-22°C. Temperaturas por debajo de 15°C o por encima de 30°C pueden estresar las plantas y afectar negativamente el crecimiento.',
    },
    {
      id: 5,
      question: '¿Cuándo debo empezar a fertilizar?',
      answer: 'En sustratos pre-fertilizados, espera 2-3 semanas antes de comenzar con fertilizantes adicionales. Comienza con dosis bajas (1/4 de la recomendada) y aumenta gradualmente observando la respuesta de las plantas.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="bg-primary text-primary-foreground w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-10 h-10" />
        </div>
        <h1 className="mb-4">Info & Multimedia</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Guías completas, tutoriales en video y artículos especializados para que tu cultivo sea un éxito
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="guides" className="space-y-8">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
          <TabsTrigger value="guides" className="gap-2">
            <Lightbulb className="w-4 h-4" />
            <span className="hidden sm:inline">Guías</span>
          </TabsTrigger>
          <TabsTrigger value="videos" className="gap-2">
            <Video className="w-4 h-4" />
            <span className="hidden sm:inline">Videos</span>
          </TabsTrigger>
          <TabsTrigger value="articles" className="gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Artículos</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="gap-2">
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Guides Tab */}
        <TabsContent value="guides">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <div
                key={guide.id}
                className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="relative aspect-video overflow-hidden">
                  <ImageWithFallback
                    src={guide.image}
                    alt={guide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
                      {guide.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="mb-2 line-clamp-2">{guide.title}</h4>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {guide.description}
                  </p>
                  <Button variant="outline" size="sm">
                    Leer Guía
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <ImageWithFallback
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="mb-2 line-clamp-2">{video.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {video.views} visualizaciones
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Articles Tab */}
        <TabsContent value="articles">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <div
                key={article.id}
                className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <ImageWithFallback
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="mb-2 line-clamp-2">{article.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <span>{new Date(article.date).toLocaleDateString('es-AR')}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Leer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq">
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq) => (
                <AccordionItem 
                  key={faq.id} 
                  value={`faq-${faq.id}`}
                  className="bg-card border border-border rounded-lg px-6"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <h4>{faq.question}</h4>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </TabsContent>
      </Tabs>

      {/* CTA */}
      <div className="text-center mt-12">
        <h3 className="mb-4">¿Listo para empezar tu cultivo?</h3>
        <p className="text-muted-foreground mb-6">
          Tenemos todo el equipamiento que necesitas
        </p>
        <Button size="lg" onClick={() => onNavigate('catalog')}>
          Ver Productos
        </Button>
      </div>
    </div>
  );
}
