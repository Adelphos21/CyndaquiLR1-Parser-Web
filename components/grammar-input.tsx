"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Code2, Zap } from "lucide-react"

interface GrammarInputProps {
  onAnalyze: (grammar: string, inputString: string) => void
  loading: boolean
}

export default function GrammarInput({ onAnalyze, loading }: GrammarInputProps) {
  const [grammar, setGrammar] = useState("S -> C C\nC -> c C\nC -> d")
  const [inputString, setInputString] = useState("c d d")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (grammar.trim() && inputString.trim()) {
      // Reemplazo global de '' (dos comillas simples) por el símbolo ε
      // Esto asegura que el backend reciba "ε" tal como lo definiste en Python.
      const grammarForBackend = grammar.replace(/''/g, "ε")
      onAnalyze(grammarForBackend, inputString)
    }
  }

  return (
    <Card className="p-6 sticky top-4 gradient-card glow-primary card-hover border-primary/20">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-primary/10">
        <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
          <Code2 className="w-5 h-5 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Gramática</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="grammar" className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2 block">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent"></span>
            Definición de Producciones
          </Label>
          <Textarea
            id="grammar"
            value={grammar}
            onChange={(e) => setGrammar(e.target.value)}
            placeholder="S -> C C&#10;C -> c C&#10;C -> d&#10;Usa '' para ε (se enviará como ε)"
            aria-label="Definición de la gramática; use dos comillas simples '' para indicar epsilon"
            className="font-mono text-sm h-32 resize-none bg-input/50 border-primary/20 focus:border-primary focus:ring-primary/30 transition-colors"
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <span className="text-primary">→</span> Usa saltos de línea para separar producciones. Usa <code>''</code> para ε; se convertirá a <code>ε</code> al enviarlo.
          </p>
        </div>

        <div>
          <Label htmlFor="input" className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2 block">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-accent to-primary"></span>
            Cadena a Analizar
          </Label>
          <Input
            id="input"
            value={inputString}
            onChange={(e) => setInputString(e.target.value)}
            placeholder="c d d"
            className="font-mono text-sm bg-input/50 border-accent/20 focus:border-accent focus:ring-accent/30 transition-colors"
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <span className="text-accent">→</span> Separa los símbolos con espacios
          </p>
        </div>

        <Button
          type="submit"
          disabled={loading || !grammar.trim() || !inputString.trim()}
          className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-2 h-auto transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap className="w-4 h-4 mr-2" />
          {loading ? "Analizando..." : "Analizar Gramática"}
        </Button>
      </form>
    </Card>
  )
}
