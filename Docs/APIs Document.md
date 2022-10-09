# MatchDB数据库API文档
## Workbench
### `/workbench`
Workbench用于访问数据库的后台管理系统，MatchDB的Workbench为数据库的管理提供可视化的界面，可以让后台管理者通过简便的可视化方式去操作和管理数据库。
此API是为浏览器提供访问页面的接口，有多种方式来向外暴露此接口，MatchDB开发者建议你通过nginx等web服务反向代理至MatchDB所运行的端口（默认：3020）