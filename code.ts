/// <reference types="@figma/plugin-typings" />

// Main function to get local variables and send them to the UI
/* 

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

  */

  
 // figma.ui.postMessage(variablesWithModes);
 // figma.ui.resize(500, 400); // Adjust size as needed
// }

// Main function to get local variables and send them to the UI
async function main() {
  const variables = await figma.variables.getLocalVariablesAsync();
  
  const variablesWithModes = await Promise.all(variables.map(async (variable) => {
    const collection = await figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId);
    
    const modesWithNamesAndValues = await Promise.all(Object.entries(variable.valuesByMode).map(async ([modeId, mValues]) => {
      const modeName = collection?.modes.find(m => m.modeId === modeId)?.name || 'Unknown Mode';
      const values = variable.valuesByMode[modeId];

      // Resolve aliases
      const resolvedValues = await Promise.all(Object.entries(values).map(async ([key, value]) => {
        if (value.type === 'VARIABLE_ALIAS') {
          const aliasedVariable = await figma.variables.getVariableByIdAsync(value.id);
          return [key, aliasedVariable?.valuesByMode[value.modeId] || value];
        }
        console.log('In resoved values');
        console.log(value);
        return [key, value];
        
      }));

      console.log('Skipped');
      return {
        modeName,
        values: Object.fromEntries(resolvedValues)
      };
    }));

    return {
      name: variable.name,
      modes: modesWithNamesAndValues
    };
  }));

  figma.ui.postMessage(variablesWithModes);
  figma.ui.resize(600, 500); // Adjust size as needed
}

// Run the main function and set up the UI
figma.on('run', main);

// Load the UI
figma.showUI(__html__);
