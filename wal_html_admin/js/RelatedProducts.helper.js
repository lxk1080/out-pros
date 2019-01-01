var addedproductslist;
var searchproductslist;

$(document).ready(function () {
    InitProductCategory();
    $("#relatedPeijian input[name='btnSearch']").bind("click", function () { InitSearchProductsList(1) });
});

function InitSearchProductsList(page) {
    if (page == undefined) {
        page = 1;
    }
    $("#relatedPeijian .searchproductslist").empty().append('<div class="search-background"><label><img src="skin/default/loader.gif" alt="" /></label></div>');
    $.ajax({
        url: ("tools/admin_ajax.html?action=GetProductInfoForRelate&timestamp="+Math.random()),
        type: 'POST',
        dataType: 'json',
        timeout: 10000,
        data: { key: $('#relatedPeijian input[name="txtSearchProductName"]').val(), Categoryid: $('#relatedPeijian select[name="drpProductCategory"]').val(), selectedPids: $('#relatedPeijian input[name="hfSelectedData"]').val(), page: page, productid: $('#relatedPeijian input[name="ProductID"]').val(), channel_id: $('#relatedPeijian input[name="channel_id"]').val() },
        success: function (resultData) {
            $("#relatedPeijian .searchproductslist").empty();
            if (resultData.STATUS == "OK") {
                $(resultData.DATA).each(function (i) {
                    $("#relatedPeijian .searchproductslist").append('<dl skuid="' + resultData.DATA[i].ProductId + '" id="' + resultData.DATA[i].ProductId + '"><dt><div class="borderImage"><img src="' + resultData.DATA[i].ImageUrl + '" width="80px" height="80px"></div></dt><dd style="width:270px;"><span class="name">' + resultData.DATA[i].ProductName + '</span></dd><dd class="lt"><a href="javascript:void(0);"><span class="submit_add">添加</span></a></dd></dl>');
                });
                $('.submit_add').bind('click', function () {
                    InitAddProduct(this, addedproductslist);
                });
                $('.submit_del').bind('click', function () {
                    InitDelProduct(this, searchproductslist);
                });
                $("#relatedPeijian #paginationsearch").pager({ pagenumber: resultData.PAGE, pagecount: resultData.PAGECOUNT, buttonClickCallback: function (pageclickednumber) { InitSearchProductsList(pageclickednumber); } });
            }
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            alert(xmlHttpRequest.responseText);
        }
    });
}

function InitAddedProductsList(page) {
    if (page == undefined) {
        page = 1;
    }
    $("#relatedPeijian .addedproductslist").empty().append('<div class="search-background"><label><img src="skin/default/loader.gif" alt="" /></label></div>');
    $.ajax({
        url: ("tools/admin_ajax.html?action=GetRelatedProductInfo&timestamp=").format(new Date().getTime()),
        type: 'POST',
        dataType: 'json',
        timeout: 10000,
        data: { ProductID: $('#relatedPeijian input[name="ProductID"]').val(), selectedPids: $('#relatedPeijian input[name="hfSelectedData"]').val(), page: page },
        success: function (resultData) {
            $("#relatedPeijian .addedproductslist").empty();
            if (resultData.STATUS == "OK") {
                $(resultData.DATA).each(function (i) {
                    $("#relatedPeijian .addedproductslist").append('<dl skuid="' + resultData.DATA[i].ProductId + '" id="' + resultData.DATA[i].ProductId + '"><dt><div class="borderImage"><img src="' + resultData.DATA[i].ImageUrl + '" width="80px" height="80px"></div></dt><dd style="width:270px;"><span class="name">' + resultData.DATA[i].ProductName + '</span></dd><dd class="lt"><a href="javascript:void(0);"><span class="submit_del">删除</span></a></dd>');
                });
                $("#relatedPeijian #paginationadded").pager({ pagenumber: resultData.PAGE, pagecount: resultData.PAGECOUNT, buttonClickCallback: function (pageclickednumber) { InitSearchProductsList(pageclickednumber); } });
                var SelectRelatedDataArray = $('input[name="hfSelectedData"]').val().split(',');
                for (var i = 0; i <= SelectRelatedDataArray.length - 1; i++) {
                    var relatedData = SelectRelatedDataArray[i].split('_');
                    if (relatedData[1] == 0) {
                        $("#relatedPeijian #singleRela_" + relatedData[0]).attr('checked', 'checked');
                    } else {
                        $("#relatedPeijian #doubleRela_" + relatedData[0]).attr('checked', 'checked');
                    }
                }
                $('.submit_del').bind('click', function () {
                    InitDelProduct(this, searchproductslist);
                });
            }
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            alert(xmlHttpRequest.responseText);
        }
    });
}

function InitProductCategory() {
    $('#relatedPeijian select[name="drpProductCategory"]').empty().append('<option value="">请选择</option>');
    $.ajax({
        url: "tools/admin_ajax.html?action=GetCategoriesList&timestamp=" + new Date().getTime(),
        type: 'POST',
        dataType: 'text',
        timeout: 10000,
        data: { ParentCategoryId: 0, channel_id: $('#relatedPeijian input[name="channel_id"]').val() },
        async: false,
        success: function (resultData) {
            var Data = $.parseJSON(resultData);
            if (Data.STATUS == "OK") {
                $('#relatedPeijian select[name="drpProductCategory"]').hide();
                $(Data.DATA).each(function (i) {
                    $('#relatedPeijian select[name="drpProductCategory"]').append('<option value="' + Data.DATA[i].CategoryId + '">' + Data.DATA[i].CategoryName + '</option>');
                });
                $('#relatedPeijian select[name="drpProductCategory"]').show();
            }
        }
    });

    addedproductslist = $("#relatedPeijian .addedproductslist");
    searchproductslist = $("#relatedPeijian .searchproductslist");

    $("#relatedPeijian input[name='btnClear']").click(function () {
        $("#relatedPeijian input[name='hfSelectedData']").val('');
        $("#relatedPeijian .addedproductslist").empty();
    });
}


var baseAddTable = '<table id="dlstAddedProducts" cellspacing="0" border="0" style="width:96%;border-collapse:collapse;"><tbody></tbody></table>';
var baseDelTable = '<table id="dlstSearchProducts" cellspacing="0" border="0" style="width:96%;border-collapse:collapse;"><tbody></tbody></table>';
var baseRelatedInput = ''

var highlightTime = 1500;
//购物车动态效果函数
(function ($) {
    $.extend({
        add2cart: function (sender, target, text) {

            if (sender.length < 1) return;
            if (target.length < 1) return;

            var shadow = $('#' + sender.attr("id") + '_shadow');
            if (text == undefined || text == "") {
                text = "&nbsp;";
            }
            if (!shadow.attr('id')) {
                $('body').prepend('<div id="' + sender.attr("id") + '_shadow" style="display: none; background-color: #FFDA4D; border: solid 1px darkgray; position: static; top: 0px; z-index: 100000;">' + text + '</div>');
                var shadow = $('#' + sender.attr("id") + '_shadow');
            }
            if (!shadow) {
                alert('Cannot create the shadow div');
            }
            shadow.width(sender.css('width')).height(sender.css('height')).css('top', sender.offset().top).css('left', sender.offset().left).css('opacity', 0.5).show();
            shadow.css('position', 'absolute');

            //追加处理 目标高亮 取消JqueryUI
            //            sender.hide('highlight', highlightTime);
            //            target.show('highlight', highlightTime);

            shadow.animate({ width: target.innerWidth(), height: target.innerHeight(), top: target.offset().top, left: target.offset().left }, { duration: 400 })
                .animate({ opacity: 0 }, {
                    duration: 300,
                    complete: function () {
                        //                        target.queue(function() {
                        //                            $(this).dequeue();
                        //                        });

                        //追加处理 删除原对象/重置已选择SKU
                        sender.remove();
                        shadow.remove();
                    }
                });
        }
    });
})(jQuery);

function AddSelectedSKUId(skuid, thisEvent) {
    //双向追加到父窗体和当前窗体
    var hfSelectedData = $('#relatedPeijian input[name="hfSelectedData"]');
    var parentSelectedAccessories;
    if ($($(thisEvent).parents()).find('#relatedPeijian ').length > 0) {
        parentSelectedAccessories = $('#relatedPeijian [id$=hfRelatedProducts]');
        selectProductsInfo = $('#relatedPeijian [id$=HiddenField_RelatedProductInfo]');

        var tmpSKU = hfSelectedData.val() + skuid + ',';
        parentSelectedAccessories.val(tmpSKU);
        hfSelectedData.val(tmpSKU);

        var hfSelectRelatedData = $('#relatedPeijian [id$=HiddenField_SelectRelatedData]');
        if (hfSelectRelatedData.val()) {
            hfSelectRelatedData.val(hfSelectRelatedData.val() + ',' + skuid + '');
        } else {
            hfSelectRelatedData.val(skuid + '');
        }
        selectProductsInfo.val(hfSelectRelatedData.val());
    } else {
        parentSelectedAccessories = $('#relatedPeijian [id$=hfSelectedAccessories]');

        var tmpSKU = parentSelectedAccessories.val() + skuid + ',';
        parentSelectedAccessories.val(tmpSKU);
        hfSelectedData.val(tmpSKU);
    }

    if (!parentSelectedAccessories || parentSelectedAccessories.length < 1) {
        alert('ERROR: [404] ParentSelectedAccessories Not Found!');
        return;
    }

}

function relatedChanged(thisEvent) {
    var hfSelectRelatedData = $('#relatedPeijian input[name="hfSelectedData"]');
    var SelectRelatedDataArray = hfSelectRelatedData.val().split(',');

    for (var i = 0; i <= SelectRelatedDataArray.length - 1; i++) {
        var relatedData = SelectRelatedDataArray[i].split('_');
        if ($(thisEvent).attr('i') == relatedData[0]) {
            SelectRelatedDataArray[i] = $(thisEvent).attr('i') + '_' + $(thisEvent).attr('value');
        }
    }
    hfSelectRelatedData.val(SelectRelatedDataArray.join(','));
}

function DelSelectedSKUId(skuid, thisEvent) {
    //双向删除到父窗体和当前窗体
    var hfSelectedData = $('#relatedPeijian input[name="hfSelectedData"]');
    var skus = hfSelectedData.val().split(',');
    if (skus) {
        skus.remove(skus.getIndexByValue(skuid));
    }
    var tmpSKU = skus.join(",");
    hfSelectedData.val(tmpSKU);
}

function InitDelProduct(send, targetContext) {
    $(send).unbind('click'); //撤销事件, 防止恶意点击
    var currentTableTR = $(send).parent().parent().parent();
    var currentTable = currentTableTR;
    var currentTableId = currentTableTR.attr('id');
    var targetTableTR = currentTableTR.clone();
    var relatedType = currentTable.find("input:radio:checked").val();
    var thisEvent = targetContext;

    targetTableTR.find('.submit_del').removeClass('submit_del').addClass('submit_add').text('添加').bind('click', function () {
        InitAddProduct(this, addedproductslist);
    });

    if (targetContext.find('dl').length == 0) {
        targetContext.prepend(targetTableTR);
        targetContext.find('#' + currentTableId + ' label').remove();
    } else {
        targetContext.prepend(targetTableTR);
        targetContext.find('#' + currentTableId + ' label').remove();
    }
    targetTableTR.queue(function () {
        //重置左侧滚动条到顶部
        searchproductslist.scrollTo(0, highlightTime / 2, { queue: false });
        //删除选定SKU
        DelSelectedSKUId(currentTable.attr('skuid'), thisEvent);
        //购物车效果
        $.add2cart(currentTableTR, targetTableTR, currentTableTR.html());
        $(this).dequeue();
    });
}

function InitAddProduct(send, targetContext) {
    $(send).unbind('click'); //撤销事件, 防止恶意点击
    //var currentTableTR = $(send).parents('tr:last');
    var currentTableTR = $(send).parent().parent().parent();
    var currentTable = currentTableTR;
    var currentTableId = currentTableTR.attr('id');
    var targetTableTR = currentTableTR.clone();

    var thisEvent = targetContext;

    targetTableTR.find('.submit_add').removeClass('submit_add').addClass('submit_del').text('删除').bind('click', function () {
        InitDelProduct(this, searchproductslist);
    });

    //var relatedHtml = baseRelatedInput.format(currentTableId);
    var relatedHtml = $.format(baseRelatedInput, currentTableId);

    if (targetContext.find('dl').length == 0) {
        targetContext.prepend(targetTableTR);
        targetContext.find('#' + currentTableId + ' .lt').prepend(relatedHtml);
    } else {
        targetContext.prepend(targetTableTR);
        targetContext.find('#' + currentTableId + ' .lt').prepend(relatedHtml);
    }
    targetTableTR.queue(function () {
        //重置右侧滚动条到顶部
        addedproductslist.scrollTo(0, highlightTime / 2, { queue: false });
        //追加选定SKU
        AddSelectedSKUId(currentTable.attr('skuid'), thisEvent);
        //购物车效果
        $.add2cart(currentTableTR, targetTableTR, currentTableTR.html());
        $(this).dequeue();
    });
}