import { getAutoLayoutProperties, getDiffProps, getComponentType } from './utils';
import { SUPPORTED_MUI_COMPONENTS } from './componentsList';


export function generateCodeFromFigmaNode(node: SceneNode, indentLevel = 0): string | Error {

  if (!node) {
    return new Error("オブジェクトが選択されていません。オブジェクトを選択してから実行してください。");
  }
  if (node.type === "COMPONENT") {
    return new Error("選択したオブジェクトにコンポーネントが含まれています。コードを生成できません。");
  }
  if (!node.visible) {
    return '';
  }
  
  let output = "";
  const indent = "  ".repeat(indentLevel);
  if (node.type === "INSTANCE") {
    const {elementName, componentType} = getComponentType(node.name);
    if (!SUPPORTED_MUI_COMPONENTS.includes(elementName)) {
      throw new Error(`"${elementName}"はMUIのコンポーネント名と一致しません。デバッグ情報：${JSON.stringify({nodeName: node.name, elementName, componentType})}`);
    }
    output += `${indent}<${elementName}${componentType}`;
    if (node.variantProperties) {
      for (const [key, value] of Object.entries(node.variantProperties)) {
        if (value !== "false") {
          output += ` ${key}="${value}"`;
        }
      }
    }

    if (node.mainComponent == null) {
      return new Error("メインコンポーネントが見つかりませんでした。");
    }
    const mainComponentAutoLayoutProps = getAutoLayoutProperties(node.mainComponent);
    const instanceAutoLayoutProps = getAutoLayoutProperties(node);
    if (mainComponentAutoLayoutProps && instanceAutoLayoutProps) {
      const diffProps = getDiffProps(mainComponentAutoLayoutProps, instanceAutoLayoutProps);
      let sxValue = "";
      for (const [key, value] of Object.entries(diffProps)) {
        if (key === "horizontalPadding") {
          sxValue += `px: ${(value as number) / 8}, `;
        } else if (key === "verticalPadding") {
          sxValue += `py: ${(value as number) / 8}, `;
        } else {
          output += ` ${key}={{${value}}}`;
        }
      }
      if (sxValue !== "") {
        output += ` sx={{${sxValue.slice(0, -2)}}}`;
      }
    }
    output += ">\n";
  } else if (node.type === "TEXT") {
    output += `${indent}${node.characters}\n`;
  } else {
    const {elementName, componentType} = getComponentType(node.name);
    output += `${indent}<${elementName}${componentType}>\n`;
  }

  if ("children" in node) {
    for (let child of node.children) {
      const childOutput = generateCodeFromFigmaNode(child, indentLevel + 1);
      if (childOutput instanceof Error) {
        return childOutput;
      }
      output += `${childOutput}`;
    }
  }

  if (node.type !== "TEXT") {
    output += `${indent}</${node.name.split('.')[0]}>\n`;
  }

  return output;
}
