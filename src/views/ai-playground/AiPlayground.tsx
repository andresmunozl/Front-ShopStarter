import { useState, useRef } from "react";
import { aiService, SmartSearchFilters } from "../../services/aiService";
import "./AiPlayground.css";

export default function AiPlayground() {
  // Búsqueda Inteligente State
  const [searchQuery, setSearchQuery] = useState("");
  const [aiFilters, setAiFilters] = useState<SmartSearchFilters | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Visión IA State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFile, setAiFile] = useState<File | null>(null);
  const [aiPreview, setAiPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [aiError, setAiError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🧠 Handler: Búsqueda
  async function handleSmartSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearchLoading(true);
    setSearchError(null);
    setAiFilters(null);
    
    try {
      const res = await aiService.smartSearch(searchQuery);
      if (res.success) {
        setAiFilters(res.data.filters);
      }
    } catch (err: any) {
      setSearchError(err?.error || "Error de conexión con el servidor IA.");
    } finally {
      setSearchLoading(false);
    }
  }

  // 📷 Handler: File Change
  function handleAIFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setAiFile(file);
    setCaption(null);
    setDescription("");
    setAiError(null);
    if (file) {
      setAiPreview(URL.createObjectURL(file));
    } else {
      setAiPreview(null);
    }
  }

  // ✨ Handler: Visión
  async function handleAIDescription() {
    if (!aiFile) return;
    setAiLoading(true);
    setAiError(null);
    setCaption(null);
    setDescription("");
    
    try {
      const result = await aiService.generateProductDescription(aiFile);
      if (result.success) {
        setCaption(result.data.caption);
        // Typewriter effect
        const texto = result.data.descripcion;
        let i = 0;
        const interval = setInterval(() => {
          i++;
          setDescription(texto.slice(0, i));
          if (i >= texto.length) clearInterval(interval);
        }, 25);
      }
    } catch (err: any) {
      // 🐞 FORZAR MUESTRA DEL ERROR REAL EN PANTALLA
      const fallbackMsg = "Error de conexión con el modelo de Visión IA.";
      const srvMsg = err?.error || err?.message || err?.detail || "";
      const rawDump = JSON.stringify(err, Object.getOwnPropertyNames(err), 2);
      
      setAiError(`${fallbackMsg} | Detalle: ${srvMsg}\nRAW:\n${rawDump}`);
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="sandbox-wrapper">
      <div className="sandbox-header">
        <h1 className="sandbox-title">🤖 AI Playground</h1>
        <p className="sandbox-subtitle">
          Página de pruebas independientes para los módulos de Inteligencia Artificial del Backend.
        </p>
      </div>

      <div className="sandbox-grid">
        
        {/* 🧠 Módulo Búsqueda */}
        <div className="sandbox-card">
          <div className="sandbox-card-header">
            <h2>🧠 Búsqueda Natural (NLP)</h2>
            <p>Convierte lenguaje natural a filtros estructurados (Categoría, Precio Max, Localización).</p>
          </div>
          
          <form className="sandbox-form" onSubmit={handleSmartSearch}>
            <input
              type="text"
              className="sandbox-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Ej: "ropa barata" o "comida cerca"'
            />
            <button 
              type="submit" 
              className={`sandbox-btn ${searchLoading ? 'loading' : ''}`}
              disabled={searchLoading || !searchQuery}
            >
              {searchLoading ? "Analizando..." : "Extraer Filtros"}
            </button>
          </form>

          {searchError && <div className="sandbox-alert error">{searchError}</div>}
          
          {aiFilters && (
            <div className="sandbox-result">
              <h3>Resultado del Modelo NLP:</h3>
              <pre className="sandbox-json">
{JSON.stringify(aiFilters, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* 📷 Módulo Visión */}
        <div className="sandbox-card">
          <div className="sandbox-card-header">
            <h2>📷 Visión (Generación de Descripciones)</h2>
            <p>Sube una imagen y la IA generará el captioning (lo que ve) y una descripción comercial.</p>
          </div>

          <div className="sandbox-vision-box">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              id="sandbox-ai-file"
              onChange={handleAIFileChange}
              className="sandbox-file-input hidden"
              style={{ display: 'none' }}
            />
            <div className="sandbox-vision-controls">
                <button 
                  type="button" 
                  className="sandbox-btn secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {aiFile ? "Cambiar Imagen" : "📂 Seleccionar Imagen"}
                </button>
                <button
                  type="button"
                  onClick={handleAIDescription}
                  disabled={aiLoading || !aiFile}
                  className={`sandbox-btn ${aiLoading ? 'loading' : ''}`}
                >
                  {aiLoading ? "Generando..." : "✨ Analizar Imagen"}
                </button>
            </div>

            {aiPreview && (
              <div className="sandbox-preview-container">
                 <img src={aiPreview} alt="preview IA" className="sandbox-preview-img" />
              </div>
            )}
            
            {aiError && <div className="sandbox-alert error mt-3" style={{ whiteSpace: "pre-wrap", wordBreak: "break-all", fontSize: "0.8rem", textAlign: "left" }}>{aiError}</div>}

            {caption && (
               <div className="sandbox-result mt-3">
                  <p><strong>Análisis Visual (IA):</strong> <em className="text-primary">"{caption}"</em></p>
                  <div className="divider-custom my-2"></div>
                  <p className="description-label">Descripción Comercial Sugerida:</p>
                  <p className="description-text">{description}</p>
               </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
