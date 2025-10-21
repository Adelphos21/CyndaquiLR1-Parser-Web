"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import GrammarInput from "@/components/grammar-input"
import AnalysisResults from "@/components/analysis-results"
import { Loader2, Sparkles } from "lucide-react"

export default function Home() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAnalyze = async (grammar: string, inputString: string) => {
    setLoading(true)
    setError("")
    setResults(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grammar, input_string: inputString }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Error en el análisis")
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-accent/3 to-background">
      <div className="relative overflow-hidden border-b border-border/50 bg-gradient-to-r from-primary/5 via-accent/5 to-accent/5 backdrop-blur-sm">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="badge-gradient text-xs font-semibold text-primary">LR(1) Parser</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
            Parser Analyzer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Analiza gramáticas y cadenas usando el método LR(1). Visualiza estados, tablas de análisis y árboles
            sintácticos.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <GrammarInput onAnalyze={handleAnalyze} loading={loading} />
          </div>

          <div className="lg:col-span-2">
            {error && (
              <Card className="p-4 bg-destructive/10 border-destructive/20 mb-4 card-hover">
                <p className="text-destructive font-semibold">⚠️ Error: {error}</p>
              </Card>
            )}

            {loading && (
              <Card className="p-12 flex items-center justify-center gradient-card glow-primary">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-12 h-12">
                    <Loader2 className="w-12 h-12 text-primary animate-spin absolute" />
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full opacity-20 animate-pulse"></div>
                  </div>
                  <p className="text-muted-foreground font-medium">Analizando tu gramática...</p>
                </div>
              </Card>
            )}

            {results && !loading && <AnalysisResults data={results} />}

            {!results && !loading && !error && (
              <Card className="p-12 text-center gradient-card glow-accent">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-accent/20 to-accent/20">
                    <Sparkles className="w-6 h-6 text-accent" />
                  </div>
                  <p className="text-muted-foreground font-medium">Ingresa una gramática y una cadena para comenzar</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
