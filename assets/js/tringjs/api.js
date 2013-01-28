TRING.Api = {

    get_meters : function(callback) {
        url = TRING.API_URL+"?icp="+icp;
        this.get_url(url, callback);
    },

    get_raw_day : function(date, callback) {
        url = TRING.API_URL+"?icp="+icp+"&raw_start="+date;
        this.get_url(url, callback);
    },

    get_raw_days : function(start, end, callback) {
        url = TRING.API_URL+"?icp="+icp+"&raw_start="+start+"&raw_end="+end;
        this.get_url(url, callback);
    },

    get_raw_month : function(date, callback) {
        dateobj = new Date(Date.parse(date.replace(/-/g,"/")));
        var end_day = new Date(dateobj.getFullYear(), dateobj.getMonth() + 1, 0);
        var end_str = end_day.getFullYear() + '-' + ('0' + (end_day.getMonth()+1)).slice(-2) + '-' + ('0' + end_day.getDate()).slice(-2);
        this.get_raw_days(date, end_str, callback);
    },

    get_raw_months : function(start, end, callback) {
        dateobj = new Date(Date.parse(end.replace(/-/g,"/")));
        var end_day = new Date(dateobj.getFullYear(), dateobj.getMonth() + 1, 0);
        var end_str = end_day.getFullYear() + '-' + ('0' + (end_day.getMonth()+1)).slice(-2) + '-' + ('0' + end_day.getDate()).slice(-2);
        this.get_raw_days(start, end_str, callback);
    },

    get_summary_day : function(date, callback) {
        url = TRING.API_URL+"?icp="+icp+"&day_summary_start="+date;
        this.get_url(url, callback);
    },

    get_summary_days : function(start, end, callback) {
        url = TRING.API_URL+"?icp="+icp+"&day_summary_start="+start+"&day_summary_end="+end;
        this.get_url(url, callback);
    },

    get_summary_month : function(date, callback) {
        url = TRING.API_URL+"?icp="+icp+"&month_summary_start="+date;
        this.get_url(url, callback);
    },

    get_summary_months : function(start, end, callback) {
        url = TRING.API_URL+"?icp="+icp+"&month_summary_start="+start+"&month_summary_end="+end;
        this.get_url(url, callback);
    },

    get_url : function(url, callback) {
        console.log(url)
        $.ajax({
            url: url,
            dataType: 'jsonp',
            success: function(data) {
                callback(data);
            }
        });
    },
};