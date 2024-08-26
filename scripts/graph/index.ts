import fs from 'fs';
import path from 'path';
import QuickChart from 'quickchart-js';
import { setUpAccounts, setUpErc20 } from '../deploy/setUp';
import { estimateEthTransfer } from "../estimate/estimateEthTransfer";
import { estimateErc20 } from "../estimate/estimateErc20";

async function main() {
    let filePath1: string;
    let filePath2: string;

    // Get the file paths. If they don't exist, estimate the gas usage and generate the files.
    try {
        filePath1 = path.resolve(__dirname, '../../gas/eth_transfer.json');
        filePath2 = path.resolve(__dirname, '../../gas/erc20_transfer.json');
    } catch (error) {
        console.log('Error: ', error);
        console.log('Estimating gas usage...');
        const accounts = await setUpAccounts();
        const erc20Addr = await setUpErc20(accounts.addr4337, accounts.addr7560);

        filePath1 = await estimateEthTransfer(accounts);
        filePath2 = await estimateErc20(accounts, erc20Addr);
    }

    console.log('Drawing the graph...');

    // Draw the graph
    await drawGraph(filePath1, 'eth_transfer');
    await drawGraph(filePath2, 'erc20');
}

async function drawGraph(filePath: string, name: string) {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(rawData);
    const title = name === 'eth_transfer' ? 'ETH Transfer' : 'ERC20 Transfer';
    const labels = Object.keys(jsonData);
    const data = Object.values(jsonData).map(Number);

    // Create a new QuickChart instance
    const chart = new QuickChart();
    chart.setWidth(800);
    chart.setHeight(600);
    chart.setBackgroundColor('white');

    // Set up the chart configuration
    chart.setConfig({
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: ['rgba(54, 162, 235, 0.7)', 'rgba(255, 99, 132, 0.7)'],
                    borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
                    borderWidth: 1,
                    barThickness: 120,
                },
            ],
        },
        options: {
            title: {
                display: true,
                text: `Gas Usage Comparison for ${title}: ERC-4337 vs RIP-7560`,
                fontSize: 26,
                padding: 20,
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true, 
                        fontSize: 16,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Gas Usage',
                        fontSize: 20,
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontSize: 20,
                    },
                }],
            },
            legend: {
                display: false,
            }
        },
    });
    const chartImageBuffer = await chart.toBinary();

    // Save the image to a file
    const outputFilePath = path.resolve(__dirname, `../../gas/${name}_chart.png`);
    fs.writeFileSync(outputFilePath, chartImageBuffer);
}

main().then(() => {
    console.log('Successfully saved the chart image.');
}).catch((error) => {
    console.error(error);
});