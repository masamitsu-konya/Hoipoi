export function getAutoLayoutProperties(node: SceneNode) {
  if (node.type !== 'FRAME' && node.type !== 'COMPONENT' && node.type !== 'INSTANCE') {
    return null;
  }

  return {
    layoutMode: node.layoutMode,
    counterAxisSizingMode: node.counterAxisSizingMode,
    horizontalPadding: node.horizontalPadding,
    verticalPadding: node.verticalPadding,
    itemSpacing: node.itemSpacing,
    constraints: `horizontal: ${node.constraints.horizontal}, vertical: ${node.constraints.vertical}`
  };
}

export function getDiffProps(obj1: any, obj2: any) {
  const diffProps: any = {};
  for (const [key, value] of Object.entries(obj1)) {
    if (obj2[key] !== value) {
      diffProps[key] = obj2[key];
    }
  }
  return diffProps;
}

export function getComponentType(nodeName: string) {
  const nameParts = nodeName.split('.');
  return {
    elementName: nameParts[0],
    componentType: nameParts.length > 1 ? ` component="${nameParts[1]}"` : ""
  };
}
