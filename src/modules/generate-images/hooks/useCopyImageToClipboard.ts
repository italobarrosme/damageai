import { useEffect, useCallback, useRef, useState } from "react";

/**
 * Hook responsável por copiar uma imagem para o clipboard quando o usuário
 * pressiona Ctrl+C (ou Cmd+C no Mac).
 *
 * Este hook detecta o atalho de teclado e converte a imagem (base64 ou URL)
 * em um Blob para copiar para a área de transferência.
 *
 * ---
 *
 * 🔹 Funcionalidades:
 * - Detecta Ctrl+C (Windows/Linux) ou Cmd+C (Mac)
 * - Converte imagem base64/URL para Blob
 * - Copia a imagem para o clipboard usando a Clipboard API
 * - Fornece função manual para copiar programaticamente
 *
 * 🔹 Retorno:
 * - `copyImage`: função para copiar a imagem manualmente
 * - `isCopied`: estado indicando se a imagem foi copiada recentemente
 *
 * ---
 *
 * @param {string | null} imageUrl - URL da imagem (base64 ou URL) a ser copiada
 * @param {boolean} enabled - Se true, habilita a detecção de Ctrl+C (padrão: true)
 * @returns {{
 *   copyImage: () => Promise<void>
 *   isCopied: boolean
 * }}
 *
 * @example
 * ```tsx
 * const { copyImage, isCopied } = useCopyImageToClipboard(generatedImage)
 *
 * // Copiar manualmente
 * await copyImage()
 *
 * // Ctrl+C será detectado automaticamente quando enabled=true
 * ```
 */
export function useCopyImageToClipboard(
  imageUrl: string | null,
  enabled: boolean = true,
) {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Converte a imagem (base64 ou URL) em Blob e copia para o clipboard
   */
  const copyImage = useCallback(async () => {
    if (!imageUrl) return;

    try {
      // Converte base64 ou URL para Blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Copia para o clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      // Atualiza estado de copiado
      setIsCopied(true);

      // Limpa timeout anterior se existir
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Reseta o estado após 2 segundos
      timeoutRef.current = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Erro ao copiar imagem:", error);
    }
  }, [imageUrl]);

  /**
   * Detecta Ctrl+C (Windows/Linux) ou Cmd+C (Mac)
   */
  useEffect(() => {
    if (!enabled || !imageUrl) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+C (Windows/Linux) ou Cmd+C (Mac)
      const isCopyShortcut =
        (event.ctrlKey || event.metaKey) && event.key === "c";

      if (isCopyShortcut) {
        // Previne o comportamento padrão apenas se a imagem estiver visível
        event.preventDefault();
        copyImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, imageUrl, copyImage]);

  return {
    copyImage,
    isCopied,
  };
}
