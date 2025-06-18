(function()
{
    return function()  
	{
        this.on_loadAppVariables = function()
        {		
            var obj = null;
            
            // global dataset

            
            // global variable

            
            obj = null;
        };
 
        // property, event, createMainFrame
        this.on_initApplication = function()
        {
            // properties
            this.set_id("developer_application");
            this.set_screenid("Desktop_screen");

            if (this._is_attach_childframe)
            	return;
        
            // frame
            var mainframe = this.createMainFrame("mainframe","0","0","1280","720",null,null,this);
            mainframe.set_showtitlebar("true");
            mainframe.set_showstatusbar("true");
            mainframe.on_createBodyFrame = this.mainframe_createBodyFrame;        

            // tray

        };
        
        this.loadPreloadList = function()
        {

        };
        
        this.mainframe_createBodyFrame = function()
        {

        };
        
        this.on_initEvent = function()
        {

        };
        
        // script Compiler
        this.loadCss("style.xcss");

        this.checkLicense("");
        
        this.loadPreloadList();

        this.loadIncludeScript("developer_application.xadl");
    };
}
)();
