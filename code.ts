// デザコン ver 1.1.0
import { generateCodeFromFigmaNode } from './codeGenerator';

if (figma.editorType === 'figma') {

  figma.showUI(__html__);

  figma.ui.onmessage = msg => {
    if (msg.type === 'generate-code') {

      const selection = figma.currentPage.selection;
      if (selection.length !== 1) {
        console.error("1つのオブジェクトを選択してください。");
      } else {
        const codeOrError = generateCodeFromFigmaNode(selection[0]);
        if (codeOrError instanceof Error) {
          console.error(codeOrError.message);
        } else {
          console.log(codeOrError);
        }
      }

      figma.closePlugin();
    }
  }
};
