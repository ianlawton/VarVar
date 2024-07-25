/// <reference types="@figma/plugin-typings" />

// Main function to get local variables and send them to the UI
/* async function main() {
  const variables = await figma.variables.getLocalVariablesAsync();
  console.log(variables);
  const variablesWithModes = variables.map(variable => (
    {
    
    name: variable.name,
    collectiondId: variable.variableCollectionId,
    modes: Object.entries(variable.valuesByMode).map(([modeId, values]) => {
      console.log(modeId)
      console.log(values) 

     // const mode = figma.variables..getModeById(modeId);
     // return {
     //   modeName: mode.name,
     //   values: values
     // };
    })
  }));
  */

  async function main() {
    const variables = await figma.variables.getLocalVariablesAsync();
    
    // Fetch mode names using the collection
    const variablesWithModes = await Promise.all(variables.map(async (variable) => {
      const collection = await figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId);
      
      const modesWithNames = Object.entries(variable.valuesByMode).map(([modeId, values]) => { {
        const modeName = collection?.modes.find(m => m.modeId === modeId)?.name || 'Unknown Mode';
        return {
          modeName,
          values: variable.valuesByMode[modeId]
        };
      }});
  
      return {
        name: variable.name,
        modes: modesWithNames
      };
    }));
  
    figma.ui.postMessage(variablesWithModes);
    figma.ui.resize(500, 400); // Adjust size as needed
  }


 // figma.ui.postMessage(variablesWithModes);
 // figma.ui.resize(500, 400); // Adjust size as needed
// }

// Run the main function and set up the UI
figma.on('run', main);

// Load the UI
figma.showUI(__html__);
