////////////////////////////////////////////////////////////////////////////////////////
//Page 전역 변수
////////////////////////////////////////////////////////////////////////////////////////
var selectId; // 제품 아이디
var selectName; // 제품 이름
var selectedIndex; // 데이터테이블 선택한 인덱스
var selectedPage; // 데이터테이블 선택한 인덱스
var dataTableRef; // 데이터테이블 참조 변수

function execDocReady() {

	var pluginGroups = [
		[
		    "/src/reference/light-blue/lib/vendor/jquery.ui.widget.js",
			"/src/reference/light-blue/lib/vendor/http_blueimp.github.io_JavaScript-Templates_js_tmpl.js",
			"/src/reference/light-blue/lib/vendor/http_blueimp.github.io_JavaScript-Load-Image_js_load-image.js",
			"/src/reference/light-blue/lib/vendor/http_blueimp.github.io_JavaScript-Canvas-to-Blob_js_canvas-to-blob.js",
			"/src/reference/light-blue/lib/jquery.iframe-transport.js",
			"/src/reference/light-blue/lib/jquery.fileupload.js",
			"/src/reference/light-blue/lib/jquery.fileupload-fp.js",
			"/src/reference/light-blue/lib/jquery.fileupload-ui.js",
		],

		[
		    "/src/reference/jquery-plugins/select2-4.0.2/dist/css/select2_lightblue4.css",
			"/src/reference/jquery-plugins/lou-multi-select-0.9.12/css/multiselect-lightblue4.css",
			"/src/reference/jquery-plugins/multiple-select-1.5.2/dist/multiple-select-bluelight.css",
			"/src/reference/jquery-plugins/select2-4.0.2/dist/js/select2.min.js",
			"/src/reference/jquery-plugins/lou-multi-select-0.9.12/js/jquery.quicksearch.js",
			"/src/reference/jquery-plugins/lou-multi-select-0.9.12/js/jquery.multi-select.js",
			"/src/reference/jquery-plugins/multiple-select-1.5.2/dist/multiple-select.min.js"
        ],

		[
		    "/src/reference/jquery-plugins/datetimepicker-2.5.20/build/jquery.datetimepicker.min.css",
			"/src/reference/light-blue/lib/bootstrap-datepicker.js",
			"/src/reference/jquery-plugins/datetimepicker-2.5.20/build/jquery.datetimepicker.full.min.js",
			"/src/reference/lightblue4/docs/lib/widgster/widgster.js",
			"/src/reference/lightblue4/docs/lib/slimScroll/jquery.slimscroll.min.js",
			"./html/sb-admin/vendor/bootstrap/js/bootstrap.bundle.min.js",
			"./html/sb-admin/vendor/datatables/dataTables.bootstrap4.min.css",
			"./html/sb-admin/vendor/datatables/jquery.dataTables.min.js",
			"./html/sb-admin/vendor/datatables/dataTables.bootstrap4.min.js",
			/*"./html/sb-admin/js/demo/datatables-demo.js",*/
		],

		[
			/*"/src/reference/jquery-plugins/dataTables-1.10.16/media/css/jquery.dataTables_lightblue4.css",
			"/src/reference/jquery-plugins/dataTables-1.10.16/extensions/Responsive/css/responsive.dataTables_lightblue4.css",
			"/src/reference/jquery-plugins/dataTables-1.10.16/extensions/Select/css/select.dataTables_lightblue4.css",*/
			"/src/reference/jquery-plugins/dataTables-1.10.16/media/js/jquery.dataTables.min.js",
			"/src/reference/jquery-plugins/dataTables-1.10.16/extensions/Responsive/js/dataTables.responsive.min.js",
			"/src/reference/jquery-plugins/dataTables-1.10.16/extensions/Select/js/dataTables.select.min.js",
			"/src/reference/jquery-plugins/dataTables-1.10.16/extensions/RowGroup/js/dataTables.rowsGroup.min.js",
			"/src/reference/jquery-plugins/dataTables-1.10.16/extensions/Buttons/js/dataTables.buttons.min.js",
			"/src/reference/jquery-plugins/dataTables-1.10.16/extensions/Buttons/js/buttons.html5.js",
			"/src/reference/jquery-plugins/dataTables-1.10.16/extensions/Buttons/js/buttons.print.js",
			"/src/reference/jquery-plugins/dataTables-1.10.16/extensions/Buttons/js/jszip.min.js",
			"/src/reference/jquery-plugins/dataTables-1.10.16/extensions/Buttons/js/pdfmake.min.js"
        ]
		// 추가적인 플러그인 그룹들을 이곳에 추가하면 됩니다.
	];

	loadPluginGroupsParallelAndSequential(pluginGroups)
		.then(function () {

			////////////////////////////////////////////////////////////////////////////////////////
			//Document Ready
			////////////////////////////////////////////////////////////////////////////////////////

			//vfs_fonts 파일이 커서 defer 처리 함.
			// setTimeout(function () {
			// 	var script = document.createElement("script");
			// 	script.src = "/src/reference/jquery-plugins/dataTables-1.10.16/extensions/Buttons/js/vfs_fonts.js";
			// 	script.defer = true; // defer 속성 설정
			// 	document.head.appendChild(script);
			// }, 3000); // 3초 후에 실행됩니다.
			console.log('모든 플러그인 로드 완료');

            // common.js에서 fullName과 userName으로 헤더에 이름과 아이콘 바인딩
            getUserFullName();
            setIconByUser();

			// 사이드 메뉴 토클 이벤트 설정
			sidebarToggleButtonAndTop();

			// 사이드 메뉴 탭 클릭 이벤트 설정
			setSideMenuActive("sidebar_menu_product_service", "sidebar_menu_list_components_product_manage");

			// 상세보기, 편집하기, 삭제하기 탭 이벤트 설정
			tab_click_event();

			// 신규 제품 등록버튼
			save_btn_click();

			update_btn_click();

			delete_btn_click();

			// ---  데이터테이블 로드 설정 --- //
			var waitDataTable = setInterval(function () {
				try {
					if (!$.fn.DataTable.isDataTable("#pdservice_datatable")) {
						dataTableLoad();
						clearInterval(waitDataTable);
					}
				} catch (err) {
					console.log("서비스 데이터 테이블 로드가 완료되지 않아서 초기화 재시도 중...");
				}
			}, 313 /*milli*/);

			// --- 에디터 설정 편집하기 탭, 모달 창 등--- //
			var waitCKEDITOR = setInterval(function () {
				try {
					if (window.CKEDITOR) {
						if(window.CKEDITOR.status == "loaded"){
						    CKEDITOR.replace("detailview_pdservice_contents",{ skin: "office2013" }); // 상세보기
							CKEDITOR.replace("input_pdservice_editor",{ skin: "office2013" }); //편집하기
							// CKEDITOR.replace("extend_modal_editor",{ skin: "office2013" }); //팝업편집
							CKEDITOR.replace("modal_editor",{ skin: "office2013" }); //서비스추가
							clearInterval(waitCKEDITOR);
						}
					}
				} catch (err) {
					console.log("CKEDITOR 로드가 완료되지 않아서 초기화 재시도 중...");
				}
			}, 313 /*milli*/);

		})
		.catch(function (e) {
			console.error(e);
			console.error('플러그인 로드 중 오류 발생');
		});
}

////////////////////////////////////////////////////////////////////////////////////////
//--- 데이터 테이블 설정 ---//
////////////////////////////////////////////////////////////////////////////////////////
function dataTableLoad() {
	// 데이터 테이블 컬럼 및 열그룹 구성
	var columnList = [
		{ name: "c_id", title: "제품(서비스) 아이디", data: "c_id", visible: false },
		{
			name: "c_title",
			title: "제품(서비스) 이름",
			data: "c_title",
			render: function (data, type, row, meta) {
				if (type === "display") {
					return '<label style="color: #313131">' + data + "</label>";
				}
				return data;
			},
			/*className: "dt-body-left",*/
			visible: true
		}
	];
	var rowsGroupList = [];
	var columnDefList = [];
	var selectList = {};
	var orderList = [[0, "asc"]];
	var buttonList = [
		"copy",
		"excel",
		"print",
		{
			extend: "csv",
			text: "Export csv",
			charset: "utf-8",
			extension: ".csv",
			fieldSeparator: ",",
			fieldBoundary: "",
			bom: true
		},
		{
			extend: "pdfHtml5",
			orientation: "landscape",
			pageSize: "LEGAL"
		}
	];

	var jquerySelector = "#pdservice_datatable";
	var ajaxUrl = "/auth-user/api/arms/pdServicePure/getPdServiceMonitor.do";
	var jsonRoot = "response";
	var isServerSide = false;

	dataTableRef = dataTable_build(
		jquerySelector,
		ajaxUrl,
		jsonRoot,
		columnList,
		rowsGroupList,
		columnDefList,
		selectList,
		orderList,
		buttonList,
		isServerSide
	);

	$("#copychecker").on("click", function () {
		dataTableRef.button(".buttons-copy").trigger();
	});
	$("#printchecker").on("click", function () {
		dataTableRef.button(".buttons-print").trigger();
	});
	$("#csvchecker").on("click", function () {
		dataTableRef.button(".buttons-csv").trigger();
	});
	$("#excelchecker").on("click", function () {
		dataTableRef.button(".buttons-excel").trigger();
	});
	$("#pdfchecker").on("click", function () {
		dataTableRef.button(".buttons-pdf").trigger();
	});
}

////////////////////////////////////////////////////////////////////////////////////
///////////////////////////--- 데이터 테이블 구성 필수 ---//////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// 데이터 테이블 구성 이후 꼭 구현해야 할 메소드 : 열 클릭시 이벤트
function dataTableClick(tempDataTable, selectedData) {
	init_detail_tab();

	console.log("[ pdService :: dataTableClick ] :: tempDataTable → ");
	console.log(tempDataTable);
	console.log("[ pdService :: dataTableClick ] :: selectedData → ");
	console.log(selectedData);

	selectedIndex = selectedData.selectedIndex;
	selectedPage = selectedData.selectedPage;
	selectId = selectedData.c_id;

	$("#fileIdlink").val(selectedData.c_id);
	selectName = selectedData.c_title;
	pdServiceDataTableClick(selectedData.c_id);

	//파일 업로드 관련 레이어 보이기 처리
	$(".body-middle").show();
	// 이미지 CRUD 관련 HTML 태그 hide 처리. <편집하기> tab 에서만 보여준다.
	$(".pdservice-image-row").hide();

	//파일 리스트 초기화
	$("table tbody.files").empty();
	// Load existing files:
	/*	var $fileupload = $("#fileupload");

        $.ajax({
            // Uncomment the following to send cross-domain cookies:
            //xhrFields: {withCredentials: true},
            url: "/auth-user/api/arms/fileRepository/getFilesByNode.do",
            data: { fileIdLink: selectId },
            dataType: "json",
            context: $fileupload[0]
        }).done(function (result) {
            $(this).fileupload("option", "done").call(this, null, { result: result });
            $(".file-delete-btn").hide(); // 파일 리스트에서 delete 버튼 display none 처리 -> 편집하기 tab 에서만 보여준다.
        });*/
}

//데이터 테이블 ajax load 이후 콜백.
function dataTableCallBack(settings, json) {
	console.log("[ pdService :: dataTableCallBack ] :: json → ");
	console.log(json);
}

// 데이터 테이블 최종 로드
function dataTableDrawCallback(tableInfo) {
	console.log("[ pdService :: dataTableDrawCallback ] :: tableInfo → ");
	console.log(tableInfo);

	$("#" + tableInfo.sInstance)
		.DataTable();
	/*.columns.adjust()
    .responsive.recalc();*/
}
////////////////////////////////////////////////////////////////////////////////////
///////////////////////////--- 데이터 테이블 구성 필수 ---//////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////
// --- 데이터 테이블 클릭 시 우측 데이터 바인딩 --- //
// 1. 상세보기 데이터 바인딩
// 2. 편집하기 데이터 바인딩
////////////////////////////////////////////////////////////////////////////////////////
function pdServiceDataTableClick(c_id) {
	console.log("[ pdService :: pdServiceDataTableClick ] :: c_id → " + c_id);

	$.ajax({
		url: "/auth-user/api/arms/pdServicePure/getNode.do", // 클라이언트가 HTTP 요청을 보낼 서버의 URL 주소
		data: { c_id: c_id }, // HTTP 요청과 함께 서버로 보낼 데이터
		method: "GET", // HTTP 요청 메소드(GET, POST 등)
		dataType: "json", // 서버에서 보내줄 데이터의 타입
		beforeSend: function () {
			$(".loader").removeClass("hide");
		}
	})
		// HTTP 요청이 성공하면 요청한 데이터가 done() 메소드로 전달됨.
		.done(function (json) {
			console.log("[ pdService :: pdServiceDataTableClick ] :: pdService data response → ");
			console.log(json);

			// 최상단 선택된 제품명 바인딩
			$("#select_Service").text(json.c_title);

			//--- 상세보기 탭 데이터 바인딩 ---//
			detailview_data_binding(json);

			//--- 편집하기 탭 데이터 바인딩 ---//
			editview_data_binding(json);

		})
		// HTTP 요청이 실패하면 오류와 상태에 관한 정보가 fail() 메소드로 전달됨.
		.fail(function (xhr, status, errorThrown) {
			console.log(xhr + status + errorThrown);
		})
		//
		.always(function (xhr, status) {
			console.log(xhr + status);
			$(".loader").addClass("hide");
		});

	$("#delete_text").text($("#pdservice_datatable").DataTable().rows(".selected").data()[0].c_title);
}

function detailview_data_binding(pdServiceData) {
    $("#detailview_pdservice_name").val(pdServiceData.c_title);
    if (isEmpty(pdServiceData.c_pdservice_owner) || pdServiceData.c_pdservice_owner === "none") {
        $("#detailview_pdservice_owner").val("책임자가 존재하지 않습니다.");
    } else {
        $("#detailview_pdservice_owner").val(pdServiceData.c_pdservice_owner);
    }

    if (isEmpty(pdServiceData.c_pdservice_reviewer01) || pdServiceData.c_pdservice_reviewer01 === "none") {
        $("#detailview_pdservice_reviewer01").val("리뷰어(연대책임자)가 존재하지 않습니다.");
    } else {
        $("#detailview_pdservice_reviewer01").val(pdServiceData.c_pdservice_reviewer01);
    }

    if (isEmpty(pdServiceData.c_pdservice_reviewer02) || pdServiceData.c_pdservice_reviewer02 === "none") {
        $("#detailview_pdservice_reviewer02").val("2번째 리뷰어(연대책임자) 없음");
    } else {
        $("#detailview_pdservice_reviewer02").val(pdServiceData.c_pdservice_reviewer02);
    }

    if (isEmpty(pdServiceData.c_pdservice_reviewer03) || pdServiceData.c_pdservice_reviewer03 === "none") {
        $("#detailview_pdservice_reviewer03").val("3번째 리뷰어(연대책임자) 없음");
    } else {
        $("#detailview_pdservice_reviewer03").val(pdServiceData.c_pdservice_reviewer03);
    }

    if (isEmpty(pdServiceData.c_pdservice_reviewer04) || pdServiceData.c_pdservice_reviewer04 === "none") {
        $("#detailview_pdservice_reviewer04").val("4번째 리뷰어(연대책임자) 없음");
    } else {
        $("#detailview_pdservice_reviewer04").val(pdServiceData.c_pdservice_reviewer04);
    }

    if (isEmpty(pdServiceData.c_pdservice_reviewer05) || pdServiceData.c_pdservice_reviewer05 === "none") {
        $("#detailview_pdservice_reviewer05").val("5번째 리뷰어(연대책임자) 없음");
    } else {
        $("#detailview_pdservice_reviewer05").val(pdServiceData.c_pdservice_reviewer05);
    }

    CKEDITOR.instances.detailview_pdservice_contents.setData(pdServiceData.c_pdservice_contents);
    CKEDITOR.instances.detailview_pdservice_contents.setReadOnly(true);
    // $("#detailview_pdservice_contents").html(pdServiceData.c_pdservice_contents);
}

function editview_data_binding(pdServiceData) {
    $("#editview_pdservice_name").val(pdServiceData.c_title);
    if (isEmpty(pdServiceData.c_pdservice_owner) || pdServiceData.c_pdservice_owner === "none") {
        $("#editview_pdservice_owner").val("");
    } else {
        $("#editview_pdservice_owner").val(pdServiceData.c_pdservice_owner);
    }

    if (isEmpty(pdServiceData.c_pdservice_reviewer01) || pdServiceData.c_pdservice_reviewer01 === "none") {
        $("#editview_pdservice_reviewer01").val("");
    } else {
        $("#editview_pdservice_reviewer01").val(pdServiceData.c_pdservice_reviewer01);
    }

    if (isEmpty(pdServiceData.c_pdservice_reviewer02) || pdServiceData.c_pdservice_reviewer02 === "none") {
        $("#editview_pdservice_reviewer02").val("");
    } else {
        $("#editview_pdservice_reviewer02").val(pdServiceData.c_pdservice_reviewer02);
    }

    if (isEmpty(pdServiceData.c_pdservice_reviewer03) || pdServiceData.c_pdservice_reviewer03 === "none") {
        $("#editview_pdservice_reviewer03").val("");
    } else {
        $("#editview_pdservice_reviewer03").val(pdServiceData.c_pdservice_reviewer03);
    }

    if (isEmpty(pdServiceData.c_pdservice_reviewer04) || pdServiceData.c_pdservice_reviewer04 === "none") {
        $("#editview_pdservice_reviewer04").val("");
    } else {
        $("#editview_pdservice_reviewer04").val(pdServiceData.c_pdservice_reviewer04);
    }

    if (isEmpty(pdServiceData.c_pdservice_reviewer05) || pdServiceData.c_pdservice_reviewer05 === "none") {
        $("#editview_pdservice_reviewer05").val("");
    } else {
        $("#editview_pdservice_reviewer05").val(pdServiceData.c_pdservice_reviewer05);
    }

    CKEDITOR.instances.input_pdservice_editor.setData(pdServiceData.c_pdservice_contents);
}

////////////////////////////////////////////////////////////////////////////////////////
// 탭 클릭 이벤트 처리
////////////////////////////////////////////////////////////////////////////////////////
function tab_click_event() {
	$('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
		var target = $(e.target).attr("href"); // activated tab
		console.log("[ pdService :: tab_click_event ] :: target → " + target);

		if (target == "#delete_tab_pdService") {
			// 삭제하기 모드에서 숨길 버튼
			$("#pdservice_details_popup_div").addClass("hidden");
			$("#pdservice_update_div").addClass("hidden");

			// 삭제하기 모드에서 보여줄 버튼
			$("#pdservice_delete_div").removeClass("hidden");

			$(".body-middle").hide();
			$(".pdservice-image-row").hide();
			$(".file-delete-btn").hide();

			let pdServiceId = $("#pdservice_datatable").DataTable().rows(".selected").data()[0];
			if(pdServiceId === null || pdServiceId === undefined || pdServiceId === "") {
				// init_detail_tab();
			} else {
				console.log(pdServiceId);
				$("#delete_text").text(pdServiceId.c_title);
			}
		} else if (target == "#edit_tab_pdService") {
			// 편집하기 모드에서 숨길 버튼
			$("#pdservice_details_popup_div").addClass("hidden");
			$("#pdservice_delete_div").addClass("hidden");

			// 편집하기 모드에서 보여줄 버튼
			$(".pdservice-image-row").show();
			$(".file-delete-btn").show();
			$("#pdservice_update_div").removeClass("hidden");

		} else {
			// 상세 모드에서 숨길 버튼
			$("#pdservice_update_div").addClass("hidden");
			$("#pdservice_delete_div").addClass("hidden");
			$(".pdservice-image-row").hide();
			$(".file-delete-btn").hide();

			// 상세 모드에서 보여줄 버튼
			$("#pdservice_details_popup_div").removeClass("hidden");

			if (selectId == undefined) {
				$(".body-middle").hide();
			} else {
				$(".body-middle").show();
			}
		}
	});
}


// 데이터 테이블 열 클릭 시, 상세보기 tab을 기본값으로 세팅.
function init_detail_tab() {
	console.log("[ pdService :: init_detail_tab ] :: 디테일 탭으로 초기화");

	// 데이터 테이블 열 클릭 시, 상세보기 tab을 기본값으로 세팅.
	$('div.widget-content.clearfix div.side-button').addClass('hidden');
	$('#pdservice_details_popup_div').removeClass('hidden');
	$('ul.nav-tabs li a').removeClass('active');
	$('div.tab-content .tab-pane').removeClass('active');
	$('div.tab-content .tab-pane').removeClass('show');
	$('#detail_nav_pdService').addClass('active');
	$('#detail_tab_pdService').addClass('active');
	$('#detail_tab_pdService').addClass('show');
}

///////////////////////////////
// 모달 팝업 띄울 때, UI 일부 수정되도록
////////////////////////////////
function modalPopup(popupName) {
	console.log(" [ pdService :: modalPopup ] :: popupName -> " + popupName);
	if (popupName === "modal_popup_new") {
		console.log(popupName + " 신규 제품 등록 팝업");
		//modal_popup_readOnly = 새 창으로 제품(서비스 보기)
		modalPopupDataBindingClear();
		$("#regist_pdservice").removeClass("hidden");
		$("#popup_view_pdservice_name").attr("disabled",false);

		$("#detail_pdService_modal_title").text(" 신규 제품(서비스) 등록 팝업");
		$("#detail_pdService_modal_sub").text("새 창으로 제품(서비스)를 등록합니다.");
		$("#extendupdate_pdservice").addClass("hidden");
		$("#new_pdservice_save").removeClass("hidden");
	}
	else if (popupName === "modal_popup_readonly") {
        //modal_popup_readOnly = 새 창으로 제품(서비스 보기)
		$("#popup_view_pdservice_name").attr("disabled",false);
		console.log(popupName + " 제품 내용 보기 팝업");

		$("#detail_pdService_modal_title").text(" 제품(서비스) 내용 보기 팝업");
        $("#detail_pdService_modal_sub").text("새 창으로 제품(서비스)의 정보를 확인합니다.");
        $("#extendupdate_pdservice").addClass("hidden");
        $("#new_pdservice_save").addClass("hidden");

        modalPopupDataBinding(true);
    }
	else { //팝업 창으로 편집하기
		console.log(popupName + " 제품 수정 팝업");
		$("#popup_view_pdservice_name").attr("disabled",true);

		$("#detail_pdService_modal_title").text(" 제품(서비스) 수정 팝업");
		$("#detail_pdService_modal_sub").text("A-RMS에 제품(서비스)의 정보를 수정합니다.");
		$("#new_pdservice_save").addClass("hidden");
		$("#extendupdate_pdservice").removeClass("hidden");

		// 데이터 셋팅
        modalPopupDataBinding(false);

	}
}

function modalPopupDataBindingClear() {
	$("#popup_view_pdservice_name").val("");
	$("#popup_view_pdservice_owner").val("");

	$("#popup_view_pdservice_reviewer01").val("");
	$("#popup_view_pdservice_reviewer02").val("");
	$("#popup_view_pdservice_reviewer03").val("");
	$("#popup_view_pdservice_reviewer04").val("");
	$("#popup_view_pdservice_reviewer05").val("");

	CKEDITOR.instances.modal_editor.setData("제품(서비스)의 기획서 및 Project Charter 의 내용을 기록합니다.");
}

function modalPopupDataBinding(isReadOnly) {
    /*$("#detail_pdService_modal_title").text(" 신규 제품(서비스) 수정 팝업");
    $("#detail_pdService_modal_sub").text("A-RMS에 신규 제품(서비스)의 정보를 수정합니다.");*/
	if (isReadOnly) {
		$("#regist_pdservice").addClass("hidden");
		$("#extendupdate_pdservice").addClass("hidden");
		$("#new_pdservice_save").removeClass("hidden");
	}
	else {
		$("#regist_pdservice").addClass("hidden");
		$("#new_pdservice_save").addClass("hidden");
		$("#extendupdate_pdservice").removeClass("hidden");
	}

    // 데이터 셋팅
    var selectedId = $("#pdservice_datatable").DataTable().rows(".selected").data()[0].c_id;
    console.log("selectedId →" + selectedId);
    // 제품(서비스) 이름
    $("#popup_view_pdservice_name").val($("#editview_pdservice_name").val());
    $("#popup_view_pdservice_owner").val($("#editview_pdservice_owner").val());

    $("#popup_view_pdservice_reviewer01").val($("#editview_pdservice_reviewer01").val());
    $("#popup_view_pdservice_reviewer02").val($("#editview_pdservice_reviewer02").val());
    $("#popup_view_pdservice_reviewer03").val($("#editview_pdservice_reviewer03").val());
    $("#popup_view_pdservice_reviewer04").val($("#editview_pdservice_reviewer04").val());
    $("#popup_view_pdservice_reviewer05").val($("#editview_pdservice_reviewer05").val());

    var editorData = CKEDITOR.instances.input_pdservice_editor.getData();
    console.log(editorData);
    CKEDITOR.instances.modal_editor.setData(editorData);
    CKEDITOR.instances.modal_editor.setReadOnly(isReadOnly);
}

////////////////////////////////////////////////////////////////////////////////////////
// 신규 제품(서비스) 등록 버튼
////////////////////////////////////////////////////////////////////////////////////////
function save_btn_click() {
	$("#regist_pdservice").click(function () {
		var reviewer01 = $("#popup_view_pdservice_reviewer01").val();
		var reviewer02 = $("#popup_view_pdservice_reviewer02").val();
		var reviewer03 = $("#popup_view_pdservice_reviewer03").val();
		var reviewer04 = $("#popup_view_pdservice_reviewer04").val();
		var reviewer05 = $("#popup_view_pdservice_reviewer05").val();

		const cTitle = $("#popup_view_pdservice_name").val();
		const cOwner = $("#popup_view_pdservice_owner").val();

        console.log((reviewer01 === null || reviewer01 === undefined || reviewer01) === "" ? "none" : reviewer01);
        console.log((reviewer02 === null || reviewer02 === undefined || reviewer02) === "" ? "none" : reviewer02);
        console.log((reviewer03 === null || reviewer03 === undefined || reviewer03) === "" ? "none" : reviewer03);
        console.log((reviewer04 === null || reviewer04 === undefined || reviewer04) === "" ? "none" : reviewer04);
        console.log((reviewer05 === null || reviewer05 === undefined || reviewer05) === "" ? "none" : reviewer05);

		$.ajax({
			url: "/auth-user/api/arms/pdService/addPdServiceNode.do",
			type: "POST",
			data: {
				ref: 2,
				c_title: cTitle,
				c_type: "default",
				c_pdservice_owner: cOwner,
				c_pdservice_reviewer01: (reviewer01 === null || reviewer01 === undefined || reviewer01) === "" ? "none" : reviewer01,
				c_pdservice_reviewer02: (reviewer02 === null || reviewer02 === undefined || reviewer02) === "" ? "none" : reviewer02,
				c_pdservice_reviewer03: (reviewer03 === null || reviewer03 === undefined || reviewer03) === "" ? "none" : reviewer03,
				c_pdservice_reviewer04: (reviewer04 === null || reviewer04 === undefined || reviewer04) === "" ? "none" : reviewer04,
				c_pdservice_reviewer05: (reviewer05 === null || reviewer05 === undefined || reviewer05) === "" ? "none" : reviewer05,
				c_pdservice_contents: CKEDITOR.instances.modal_editor.getData()
			},
			statusCode: {
				200: function () {
					//모달 팝업 끝내고
					$("#close_pdservice").trigger("click");
					//데이터 테이블 데이터 재 로드
					reloadDataWithSameOrdering(cTitle);
					jSuccess("신규 제품 등록이 완료 되었습니다.");
				}
			},
			beforeSend: function () {
				$("#regist_pdservice").hide();
			},
			complete: function () {
				$("#regist_pdservice").show();
			},
			error: function (e) {
				jError("신규 제품 등록 중 에러가 발생했습니다.");
			}
		});
	});
}

////////////////////////////////////////////////////////////////////////////////////////
// 최초 dataTable_build 시 정렬 기준을 dataTableRef.ajax.reload 때마다 가져와서 세팅한다.
// 일관 된 정렬을 보장하기 위한 함수이다.
////////////////////////////////////////////////////////////////////////////////////////
function reloadDataWithSameOrdering(cTitle) {
	const currentOrder = dataTableRef.order();
	dataTableRef.ajax.reload(function() {
		dataTableRef.order(currentOrder).draw();
		if(cTitle === "") return false;
		$("#pdservice_datatable tbody tr").each(function() {
			const rowTitle = $(this).find("td label").text();
			if (rowTitle === cTitle) {
				$(this).click();
				return false;
			}
		});
	});
}

////////////////////////////////////////////////////////////////////////////////////////
// 제품(서비스) 변경 저장 버튼
////////////////////////////////////////////////////////////////////////////////////////
function update_btn_click() {
	$("#pdservice_update").click(function () {

		const cId = $("#pdservice_datatable").DataTable().rows(".selected").data()[0].c_id;
		const cTitle = $("#pdservice_datatable").DataTable().rows(".selected").data()[0].c_title;
		const owner = $("#editview_pdservice_owner").val();

		var reviewer01 = $("#editview_pdservice_reviewer01").val();
		var reviewer02 = $("#editview_pdservice_reviewer02").val();
		var reviewer03 = $("#editview_pdservice_reviewer03").val();
		var reviewer04 = $("#editview_pdservice_reviewer04").val();
		var reviewer05 = $("#editview_pdservice_reviewer05").val();

		console.log((reviewer01 === null || reviewer01 === undefined || reviewer01) === "" ? "none" : reviewer01);
		console.log((reviewer02 === null || reviewer02 === undefined || reviewer02) === "" ? "none" : reviewer02);
		console.log((reviewer03 === null || reviewer03 === undefined || reviewer03) === "" ? "none" : reviewer03);
		console.log((reviewer04 === null || reviewer04 === undefined || reviewer04) === "" ? "none" : reviewer04);
		console.log((reviewer05 === null || reviewer05 === undefined || reviewer05) === "" ? "none" : reviewer05);

		console.log(cId);
		console.log(cTitle);
		console.log(owner);

		$.ajax({
			url: "/auth-user/api/arms/pdService/updateNode.do",
			type: "put",
			data: {
				c_id: cId,
				c_title: cTitle,
				c_pdservice_owner: owner,
				c_pdservice_reviewer01: reviewer01,
				c_pdservice_reviewer02: reviewer02,
				c_pdservice_reviewer03: reviewer03,
				c_pdservice_reviewer04: reviewer04,
				c_pdservice_reviewer05: reviewer05,
				c_pdservice_contents: CKEDITOR.instances.input_pdservice_editor.getData()
			},
			statusCode: {
				200: function () {
					jSuccess($("#editview_pdservice_name").val() + "의 데이터가 변경되었습니다.");

					//데이터 테이블 데이터 재 로드
					reloadDataWithSameOrdering(cTitle);
				}
			}
		});
	});
}

////////////////////////////////////////////////////////////////////////////////////////
// 버전 삭제 버튼
////////////////////////////////////////////////////////////////////////////////////////
function delete_btn_click() {
	$("#delete_pdservice").click(function () {
		console.log("delete btn");

		const c_titile = $("#select_Service").text();

		if (!confirm(c_titile +" 을(를) 삭제하시겠습니까?")) {
			return;
		}

		$.ajax({
			url: "/auth-user/api/arms/pdService/removeNode.do",
			type: "delete",
			data: {
				c_id: $("#pdservice_datatable").DataTable().rows(".selected").data()[0].c_id
			},
			statusCode: {
				200: function () {
					jError($("#editview_pdservice_name").val() + " 제품(서비스)가 삭제되었습니다.");
					//데이터 테이블 데이터 재 로드
					reloadDataWithSameOrdering("");
				}
			}
		});
	});
}