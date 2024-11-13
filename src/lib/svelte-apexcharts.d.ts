declare module 'svelte-apexcharts' {
    import { SvelteComponentTyped } from 'svelte';

    // Declare the ApexCharts component with expected props
    export interface ApexChartsProps {
        type: string;
        options: Record<string, any>;
        series: Array<{ name: string; data: number[] }>;
        width?: string | number;
        height?: string | number;
    }

    export default class ApexCharts extends SvelteComponentTyped<ApexChartsProps> {}
}