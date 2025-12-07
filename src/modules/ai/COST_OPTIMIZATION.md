# 💰 Técnicas de Otimização de Custos de Prompts

Este documento descreve as técnicas implementadas e recomendações adicionais para reduzir os custos do uso de APIs de IA.

## 🎯 Técnicas Implementadas

### 1. **Otimização de Prompts** ✅
- **Redução**: ~40-50% de tokens no prompt
- **Como funciona**: Removemos redundâncias, combinamos instruções e usamos linguagem mais concisa
- **Impacto**: Menos tokens = menor custo por requisição

**Antes:**
```
Edit this image. Do not make any changes to the photo, simply move the object freely downwards.
The goal is to simulate damage to the product shown while STRICTLY maintaining the product's original identity, shape, and perspective. 
The background should remain largely unchanged.
Apply the following damage effect: ${damageType}.
Additional details: ${customInstruction}
Ensure the damage looks photorealistic. Do not replace the object.
```

**Depois:**
```
Simulate ${damageType} damage. Maintain product identity, shape, perspective, and background. Make damage photorealistic. ${customInstruction}.
```

### 2. **Compressão de Imagens** ✅
- **Redução**: 30-70% do tamanho da imagem
- **Como funciona**: Redimensiona e comprime imagens antes de enviar
- **Impacto**: Imagens menores = menos tokens processados = menor custo

**Uso:**
```ts
import { compressImage } from "@/modules/ai";

const compressed = await compressImage(originalImage, 1024, 1024, 0.85);
```

### 3. **Sistema de Cache** ✅
- **Redução**: 20-50% de requisições duplicadas
- **Como funciona**: Armazena resultados em memória para evitar chamadas repetidas
- **Impacto**: Zero custo para requisições cacheadas

**Uso:**
```ts
import { imageCache } from "@/modules/ai";

// Automático no generateDamagedProduct
// Ou manual:
const cached = imageCache.get(image, damageType, customInstruction);
```

## 📊 Estimativa de Economia Total

Combinando todas as técnicas:
- **Otimização de prompt**: -40% tokens
- **Compressão de imagem**: -50% tokens (média)
- **Cache**: -30% requisições (estimado)

**Economia total estimada: 50-70% dos custos**

## 🚀 Técnicas Adicionais Recomendadas

### 4. **Batch Processing** (Futuro)
Se você precisar processar múltiplas imagens:
- Agrupe requisições quando possível
- Algumas APIs oferecem desconto para batch

### 5. **Modelos Mais Econômicos**
- Avalie modelos alternativos mais baratos
- `gemini-2.5-flash-image` já é uma boa escolha (mais barato que Pro)
- Considere modelos específicos para tarefas simples

### 6. **Rate Limiting Inteligente**
- Implemente fila de requisições
- Evite requisições simultâneas desnecessárias
- Use debounce para inputs do usuário

### 7. **Monitoramento de Custos**
```ts
// Exemplo de tracking
let totalTokens = 0;
let totalRequests = 0;

// Após cada requisição
totalTokens += response.usage.totalTokens;
totalRequests += 1;

console.log(`Custo estimado: $${(totalTokens * 0.00001).toFixed(4)}`);
```

### 8. **Validação Pré-API**
- Valide inputs antes de enviar
- Rejeite imagens muito grandes ou inválidas
- Evite requisições que certamente falharão

### 9. **Uso de System Prompts** (Se suportado)
- Mova instruções repetitivas para system prompt
- Reduz tokens no prompt principal
- Verifique se Gemini suporta system prompts

### 10. **Compressão de Base64**
- Considere usar formatos mais eficientes
- JPEG geralmente é melhor que PNG para fotos
- Ajuste qualidade baseado no caso de uso

## 📈 Métricas para Monitorar

1. **Tokens por requisição**: Monitore a média
2. **Taxa de cache hit**: Quanto maior, melhor
3. **Tamanho médio de imagem**: Antes e depois da compressão
4. **Custo por imagem gerada**: Total / número de imagens

## 🔧 Configurações Recomendadas

### Compressão
```ts
// Para qualidade máxima (menos compressão)
compressImage(image, 1536, 1536, 0.9)

// Para economia máxima (mais compressão)
compressImage(image, 768, 768, 0.75)

// Balanceado (recomendado)
compressImage(image, 1024, 1024, 0.85)
```

### Cache
```ts
// TTL padrão: 24 horas
// Ajuste baseado no seu caso de uso
imageCache.TTL_MS = 12 * 60 * 60 * 1000; // 12 horas
```

## ⚠️ Considerações

1. **Qualidade vs Custo**: Balanceie compressão para não perder qualidade crítica
2. **Cache Storage**: Cache em memória é limitado. Considere cache persistente (localStorage/IndexedDB) para produção
3. **Hash de Imagem**: O hash atual é simples. Para produção, use SHA-256 ou similar
4. **Limpeza de Cache**: Implemente limpeza automática para evitar vazamento de memória

## 📝 Próximos Passos

1. ✅ Otimização de prompts
2. ✅ Compressão de imagens
3. ✅ Sistema de cache
4. ⏳ Implementar tracking de custos
5. ⏳ Adicionar cache persistente (localStorage)
6. ⏳ Implementar rate limiting
7. ⏳ Dashboard de métricas

