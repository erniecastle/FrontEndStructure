jQuery(document).ready(function () {
    var DataReporte = JSON.parse(window.localStorage.getItem("DataReporte"));
    window.localStorage.removeItem("DataReporte");
    var ValoresRep = JSON.parse(DataReporte[0]);
    var titulosRep = JSON.parse(DataReporte[1]);
 

    // Create a new report instance
    var report = new Stimulsoft.Report.StiReport();
    // Load report from url
    report.loadFile(titulosRep.reporte);
    // Create new DataSet object
    var dataSet = new Stimulsoft.System.Data.DataSet("Datos");
    // Load JSON data file from specified URL to the DataSet object readJsonFile
    dataSet.readJson(ValoresRep);
    // Remove all connections from the report template
    report.dictionary.databases.clear();
    // Register DataSet object
    report.regData("Datos", "Datos", dataSet);
    report.dictionary.synchronize();
    report.dictionary.variables.getByName("tituloEmpresa").valueObject = titulosRep.tituloEmpresa;
    report.dictionary.variables.getByName("tituloDomicilio").valueObject = titulosRep.tituloDomicilio;
    report.dictionary.variables.getByName("tituloNombreReporte").valueObject = titulosRep.tituloNombreReporte;
    report.dictionary.variables.getByName("tituloPeriodo").valueObject = titulosRep.tituloPeriodo;
    if (titulosRep.tituloDatosEmpresa) {
        report.dictionary.variables.getByName("tituloDatosEmpresa").valueObject = titulosRep.tituloDatosEmpresa;
    }
    if (titulosRep.tituloConcepto) {
        report.dictionary.variables.getByName("TituloConcepto").valueObject = titulosRep.tituloConcepto;
    }
    if (titulosRep.hasOwnProperty('columnasISR') ) {
        report.dictionary.variables.getByName("columnasISR").valueObject = titulosRep.columnasISR;
    }

    if (titulosRep.hasOwnProperty('columnasIMSS')) {
        report.dictionary.variables.getByName("columnasIMSS").valueObject = titulosRep.columnasIMSS;
    }

    report.render();
    Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile("resources/es.xml");
    var options = new Stimulsoft.Viewer.StiViewerOptions();
    //options.width = "100%";
    //options.height = "100%";
    //options.appearance.backgroundColor = Stimulsoft.System.Drawing.Color.white;
    //options.appearance.pageBorderColor = Stimulsoft.System.Drawing.Color.red;
    //options.appearance.rightToLeft = true;
    //options.appearance.fullScreenMode = false;
    //options.appearance.scrollbarsMode = false;
    //options.appearance.openLinksWindow = '_blank';
    //options.appearance.openExportedReportWindow = '_blank';
    //options.appearance.showTooltips = true;
    //options.appearance.pageAlignment = Stimulsoft.Viewer.StiContentAlignment.Center;
    //options.appearance.showPageShadow = false;
    //options.appearance.bookmarksPrint = true;
    //options.appearance.interfaceType = Stimulsoft.Viewer.StiInterfaceType.Mouse;

    options.toolbar.visible = true;
    //options.toolbar.backgroundColor = Stimulsoft.System.Drawing.Color.white;
    //options.toolbar.borderColor = Stimulsoft.System.Drawing.Color.red;
    //options.toolbar.fontColor = Stimulsoft.System.Drawing.Color.red;
    //options.toolbar.fontFamily = "Arial";
    //options.toolbar.alignment = Stimulsoft.Viewer.StiContentAlignment.Center;
    options.toolbar.showButtonCaptions = false;
    options.toolbar.showOpenButton = false;
    //options.toolbar.showPrintButton = false;
    //options.toolbar.showSaveButton = false;
    options.toolbar.showSendEmailButton = true;
    options.toolbar.showBookmarksButton = false;
    options.toolbar.showParametersButton = false;
    options.toolbar.showResourcesButton = false;
    options.toolbar.showEditorButton = false;
    options.toolbar.showFullScreenButton = false;
    //options.toolbar.showFirstPageButton = false;
    //options.toolbar.showPreviousPageButton = false;
    //options.toolbar.showCurrentPageControl = false;
    //options.toolbar.showNextPageButton = false;
    //options.toolbar.showLastPageButton = false;
    options.toolbar.showZoomButton = false;
    options.toolbar.showViewModeButton = false;
    options.toolbar.showDesignButton = false;
    options.toolbar.showAboutButton = false;
    options.toolbar.showMenuMode = Stimulsoft.Viewer.StiShowMenuMode.Click;

    options.exports.showExportDialog = true;
    options.exports.showExportToDocument = false;
    //options.exports.showExportToPdf = false;
    options.exports.showExportToHtml = false;
    options.exports.showExportToHtml5 = false;
    options.exports.showExportToWord2007 = false;
    options.exports.showExportToExcel2007 = false;

    options.email.showEmailDialog = true;
    options.email.showExportDialog = true;
    //options.email.defaultEmailAddress = "";
    //options.email.defaultEmailSubject = "";
    //options.email.defaultEmailMessage = "";

  
    var viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
    viewer.report = report;
    viewer.renderHtml("report");
});