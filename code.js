"use strict";
/// <reference types="@figma/plugin-typings" />
// Main function to get local variables and send them to the UI
async function main() {
    const variables = await figma.variables.getLocalVariablesAsync();
    const variablesWithModes = variables.map(variable => ({
        name: variable.name,
        modes: Object.entries(variable.valuesByMode).map(([modeId, values]) => {
            console.log(modeId);
            console.log(values);
            // const mode = figma.variables..getModeById(modeId);
            // return {
            //   modeName: mode.name,
            //   values: values
            // };
        })
    }));
    figma.ui.postMessage(variablesWithModes);
    figma.ui.resize(500, 400); // Adjust size as needed
}
// Run the main function and set up the UI
figma.on('run', main);
// Load the UI
figma.showUI(__html__);
