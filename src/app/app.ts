import { Component, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import * as echarts from 'echarts';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements AfterViewInit {
  scrolled = false;
  showScrollTop = false;
  mobileMenuOpen = false;

  @HostListener('window:scroll')
  onScroll() {
    const y = window.scrollY;
    this.scrolled = y > 20;
    this.showScrollTop = y > 500;
  }

  ngAfterViewInit(): void {
    this.renderCharts();
    window.addEventListener('resize', () => this.renderCharts());
  }

  renderCharts() {
    const isMobile = window.innerWidth <= 480;
    this.initSkillsChart(isMobile);
    this.initImpactChart();
  }

  // Skills chart: Pie on desktop, Pareto bar on mobile
  initSkillsChart(isMobile: boolean) {
    const chartEl = document.getElementById('skillsChart');
    if (!chartEl) return;
    const chart = echarts.init(chartEl);

    if (isMobile) {
      chart.setOption({
        tooltip: { trigger: 'axis', formatter: '{b}: {c}%' },
        xAxis: { type: 'category', data: ['Angular','Node.js','MSSQL','Tools'], axisLabel:{rotate:45} },
        yAxis: { type: 'value', name: 'Skill %' },
        series: [{
          type: 'bar',
          data: [50,25,15,10],
          itemStyle:{ color:'#3f51b5' },
          label:{show:true, position:'top', color:'#000', fontWeight:'600'}
        }]
      });
    } else {
      chart.setOption({
        tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
        legend: { bottom: 0, textStyle: { fontSize: 12 }, type: 'scroll' },
        series: [{
          type: 'pie',
          radius: ['40%','70%'],
          avoidLabelOverlap:false,
          label:{ show:true, position:'outside', formatter:'{b}\n{d}%', fontWeight:'600', fontSize:12 },
          emphasis:{ itemStyle:{ shadowBlur:20, shadowColor:'rgba(0,0,0,0.3)'}},
          data:[
            { value:50, name:'Angular', itemStyle:{color:'#3f51b5'} },
            { value:25, name:'Node.js', itemStyle:{color:'#1e88e5'} },
            { value:15, name:'MSSQL', itemStyle:{color:'#2196f3'} },
            { value:10, name:'Tools', itemStyle:{color:'#64b5f6'} }
          ]
        }]
      });
    }
  }

  initImpactChart() {
  const chartEl = document.getElementById('impactChart');
  if (!chartEl) return;

  const chart = echarts.init(chartEl);

  chart.setOption({
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c}%'
    },
    xAxis: {
      type: 'category',
      data: ['Before', 'After']
    },
    yAxis: {
      type: 'value',
      name: 'Manual Effort (%)',
      max: 100
    },
    series: [
      {
        type: 'bar',
        data: [100, 70],
        barWidth: '45%',

        label: {
          show: true,
          position: 'top',
          formatter: '{c}%',
          fontSize: 14,
          fontWeight: '700',
          color: '#1f2937'   
        },

        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#3f51b5' },
            { offset: 1, color: '#5c6bc0' }
          ])
        }
      }
    ]
  });
}

  scroll(el: HTMLElement) { el.scrollIntoView({ behavior:'smooth' }); }
  scrollToTop() { window.scrollTo({ top:0, behavior:'smooth' }); }
  toggleMobileMenu() { this.mobileMenuOpen = !this.mobileMenuOpen; }
}
