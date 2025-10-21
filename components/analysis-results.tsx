"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GrammarSection from "./results/grammar-section"
import StatesSection from "./results/states-section"
import TablesSection from "./results/tables-section"
import TraceSection from "./results/trace-section"
import ASTSection from "./results/ast-section"

interface AnalysisResultsProps {
  data: any
}

export default function AnalysisResults({ data }: AnalysisResultsProps) {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="grammar" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-secondary/20">
          <TabsTrigger value="grammar">Gramática</TabsTrigger>
          <TabsTrigger value="states">Estados</TabsTrigger>
          <TabsTrigger value="tables">Tablas</TabsTrigger>
          <TabsTrigger value="trace">Traza</TabsTrigger>
          <TabsTrigger value="ast">AST</TabsTrigger>
        </TabsList>

        <TabsContent value="grammar" className="space-y-4">
          <GrammarSection data={data} />
        </TabsContent>

        <TabsContent value="states" className="space-y-4">
          <StatesSection data={data} />
        </TabsContent>

        <TabsContent value="tables" className="space-y-4">
          <TablesSection data={data} />
        </TabsContent>

        <TabsContent value="trace" className="space-y-4">
          <TraceSection data={data} />
        </TabsContent>

        <TabsContent value="ast" className="space-y-4">
          <ASTSection data={data} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
