////////////////////////////////////////////////////////////////////////////////////////
//Page 전역 변수
////////////////////////////////////////////////////////////////////////////////////////
var selectId; // 제품 아이디
var selectName; // 제품 이름
var selectedIndex; // 데이터테이블 선택한 인덱스
var selectedPage; // 데이터테이블 선택한 인덱스
var selectVersion; // 선택한 버전 아이디
var dataTableRef; // 데이터테이블 참조 변수

function execDocReady() {

	var pluginGroups = [
		["../reference/light-blue/lib/vendor/jquery.ui.widget.js",
			"../reference/light-blue/lib/vendor/http_blueimp.github.io_JavaScript-Templates_js_tmpl.js",
			"../reference/light-blue/lib/vendor/http_blueimp.github.io_JavaScript-Load-Image_js_load-image.js",
			"../reference/light-blue/lib/vendor/http_blueimp.github.io_JavaScript-Canvas-to-Blob_js_canvas-to-blob.js",
			"../reference/light-blue/lib/jquery.iframe-transport.js",
			"../reference/light-blue/lib/jquery.fileupload.js",
			"../reference/light-blue/lib/jquery.fileupload-fp.js",
			"../reference/light-blue/lib/jquery.fileupload-ui.js",
		],

		["../reference/jquery-plugins/select2-4.0.2/dist/css/select2_lightblue4.css",
			"../reference/jquery-plugins/lou-multi-select-0.9.12/css/multiselect-lightblue4.css",
			"../reference/jquery-plugins/multiple-select-1.5.2/dist/multiple-select-bluelight.css",
			"../reference/jquery-plugins/select2-4.0.2/dist/js/select2.min.js",
			"../reference/jquery-plugins/lou-multi-select-0.9.12/js/jquery.quicksearch.js",
			"../reference/jquery-plugins/lou-multi-select-0.9.12/js/jquery.multi-select.js",
			"../reference/jquery-plugins/multiple-select-1.5.2/dist/multiple-select.min.js"],

		["../reference/jquery-plugins/datetimepicker-2.5.20/build/jquery.datetimepicker.min.css",
			"../reference/light-blue/lib/bootstrap-datepicker.js",
			"../reference/jquery-plugins/datetimepicker-2.5.20/build/jquery.datetimepicker.full.min.js",
			"../reference/lightblue4/docs/lib/widgster/widgster.js",
			"../reference/lightblue4/docs/lib/slimScroll/jquery.slimscroll.min.js",
			"./html/sb-admin/vendor/bootstrap/js/bootstrap.bundle.min.js",
			"./html/sb-admin/vendor/datatables/dataTables.bootstrap4.min.css",
			"./html/sb-admin/vendor/datatables/jquery.dataTables.min.js",
			"./html/sb-admin/vendor/datatables/dataTables.bootstrap4.min.js",
			/*"./html/sb-admin/js/demo/datatables-demo.js",*/
		],

		[
			/*"../reference/jquery-plugins/dataTables-1.10.16/media/css/jquery.dataTables_lightblue4.css",
			"../reference/jquery-plugins/dataTables-1.10.16/extensions/Responsive/css/responsive.dataTables_lightblue4.css",
			"../reference/jquery-plugins/dataTables-1.10.16/extensions/Select/css/select.dataTables_lightblue4.css",*/
			"../reference/jquery-plugins/dataTables-1.10.16/media/js/jquery.dataTables.min.js",
			"../reference/jquery-plugins/dataTables-1.10.16/extensions/Responsive/js/dataTables.responsive.min.js",
			"../reference/jquery-plugins/dataTables-1.10.16/extensions/Select/js/dataTables.select.min.js",
			"../reference/jquery-plugins/dataTables-1.10.16/extensions/RowGroup/js/dataTables.rowsGroup.min.js",
			"../reference/jquery-plugins/dataTables-1.10.16/extensions/Buttons/js/dataTables.buttons.min.js",
			"../reference/jquery-plugins/dataTables-1.10.16/extensions/Buttons/js/buttons.html5.js",
			"../reference/jquery-plugins/dataTables-1.10.16/extensions/Buttons/js/buttons.print.js",
			"../reference/jquery-plugins/dataTables-1.10.16/extensions/Buttons/js/jszip.min.js",
			"../reference/jquery-plugins/dataTables-1.10.16/extensions/Buttons/js/pdfmake.min.js"]
		// 추가적인 플러그인 그룹들을 이곳에 추가하면 됩니다.
	];

	loadPluginGroupsParallelAndSequential(pluginGroups)
		.then(function () {

			////////////////////////////////////////////////////////////////////////////////////////
			//Document Ready
			////////////////////////////////////////////////////////////////////////////////////////

			//vfs_fonts 파일이 커서 defer 처리 함.
			setTimeout(function () {
				var script = document.createElement("script");
				script.src = "../reference/jquery-plugins/dataTables-1.10.16/extensions/Buttons/js/vfs_fonts.js";
				script.defer = true; // defer 속성 설정
				document.head.appendChild(script);
			}, 3000); // 3초 후에 실행됩니다.
			console.log('모든 플러그인 로드 완료');

			// common.js에서 fullName과 userName으로 헤더에 이름과 아이콘 바인딩
			getUserFullName();
			setIconByUser();

			// 사이드 메뉴 토클 이벤트 설정
			sidebarToggleButtonAndTop();

			// 사이드 메뉴 탭 클릭 이벤트 설정
			setSideMenuActive("sidebar_menu_product_service", "sidebar_menu_list_components_version_manage");

			// 상세보기, 편집하기, 삭제하기 탭 이벤트 설정
			tab_click_event();

			// 신규 제품 등록버튼
			save_btn_click();

			update_btn_click();

			delete_btn_click();

			modalPopupUpdate_btn_click();

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
                            CKEDITOR.replace("detailview_pdservice_version_contents",{ skin: "office2013" }); //상세보기
							CKEDITOR.replace("editview_pdservice_version_contents",{ skin: "office2013" }); //편집하기
							// CKEDITOR.replace("extend_modal_editor",{ skin: "office2013" }); //팝업편집
							CKEDITOR.replace("modal_editor",{ skin: "office2013" }); //서비스추가
							clearInterval(waitCKEDITOR);
						}
					}
				} catch (err) {
					console.log("CKEDITOR 로드가 완료되지 않아서 초기화 재시도 중...");
				}
			}, 313 /*milli*/);

			$("#editview_pdservice_version_start_date").datetimepicker({
                format:'Y/m/d',
                onShow:function( ct ){
                    this.setOptions({
                        maxDate:jQuery('#editview_pdservice_version_end_date').val()?jQuery('#editview_pdservice_version_end_date').val():false
                    })
                },
                timepicker:false
			});

			$("#editview_pdservice_version_end_date").datetimepicker({
                format:'Y/m/d',
                onShow:function( ct ){
                    this.setOptions({
                        minDate:jQuery('#editview_pdservice_version_start_date').val()?jQuery('#editview_pdservice_version_start_date').val():false
                    })
                },
                timepicker:false
			});

			$("#popup_view_pdservice_version_start_date").datetimepicker({
				format:'Y/m/d',
				onShow:function( ct ){
					this.setOptions({
						maxDate:jQuery('#popup_view_pdservice_version_end_date').val()?jQuery('#popup_view_pdservice_version_end_date').val():false
					})
				},
				timepicker:false
			});

			$("#popup_view_pdservice_version_end_date").datetimepicker({
				format:'Y/m/d',
				onShow:function( ct ){
					this.setOptions({
						minDate:jQuery('#popup_view_pdservice_version_start_date').val()?jQuery('#popup_view_pdservice_version_start_date').val():false
					})
				},
				timepicker:false
			});

			init_versionList();
		})
		.catch(function (e) {
			console.error(e);
			console.error('플러그인 로드 중 오류 발생');
		});
}

function formatDate(isoDateString) {
	// Date 객체 생성
	var date = new Date(isoDateString);

	// 원하는 형식으로 날짜 정보 추출
	var year = date.getFullYear();
	var month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
	var day = date.getDate();

	// 원하는 형식의 문자열로 조합
	var formattedDate = year + "/" + ("0" + month).slice(-2) + "/" + ("0" + day).slice(-2);

	// 결과 반환
	return formattedDate;
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
	$("#pdservice_version_registry_popup_div").show();
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
	// pdServiceDataTableClick(selectedData.c_id);

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

	$("#version_contents").html(""); // 버전 상세 명세 초기화

	selectId = selectedData.c_id;
	selectName = selectedData.c_title;
	console.log("selectedData.c_id : ", selectedData.c_id);
	console.log("selectedData.c_title : ", selectedData.c_title);


	$("#default_non_version").empty();
	$("#default_non_version").css("margin-bottom", "0px");

	$(".select_pdService").text(selectName);
	$("#popup_view_pdservice_name").val(selectName);

	dataLoad(selectedData.c_id, selectedData.c_title);
	detailview_clear();
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
// function pdServiceDataTableClick(c_id) {
// 	console.log("[ pdService :: pdServiceDataTableClick ] :: c_id → " + c_id);
//
// 	$.ajax({
// 		url: "/auth-user/api/arms/pdServicePure/getNode.do", // 클라이언트가 HTTP 요청을 보낼 서버의 URL 주소
// 		data: { c_id: c_id }, // HTTP 요청과 함께 서버로 보낼 데이터
// 		method: "GET", // HTTP 요청 메소드(GET, POST 등)
// 		dataType: "json", // 서버에서 보내줄 데이터의 타입
// 		beforeSend: function () {
// 			$(".loader").removeClass("hide");
// 		}
// 	})
// 		// HTTP 요청이 성공하면 요청한 데이터가 done() 메소드로 전달됨.
// 		.done(function (json) {
// 			console.log("[ pdService :: pdServiceDataTableClick ] :: pdService data response → ");
// 			console.log(json);
//
// 			// 최상단 선택된 제품명 바인딩
// 			$(".select_pdService").text(json.c_title);
//
// 			//--- 상세보기 탭 데이터 바인딩 ---//
// 			// detailview_data_binding(json);
//
// 			//--- 편집하기 탭 데이터 바인딩 ---//
// 			// editview_data_binding(json);
//
// 		})
// 		// HTTP 요청이 실패하면 오류와 상태에 관한 정보가 fail() 메소드로 전달됨.
// 		.fail(function (xhr, status, errorThrown) {
// 			console.log(xhr + status + errorThrown);
// 		})
// 		//
// 		.always(function (xhr, status) {
// 			console.log(xhr + status);
// 			$(".loader").addClass("hide");
// 		});
//
// 	$("#delete_text").text($("#pdservice_datatable").DataTable().rows(".selected").data()[0].c_title);
// }

////////////////////////////////////////////////////////////////////////////////////////
// 탭 클릭 이벤트 처리
////////////////////////////////////////////////////////////////////////////////////////
function tab_click_event() {
	$('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
		var target = $(e.target).attr("href"); // activated tab
		console.log("[ pdService :: tab_click_event ] :: target → " + target);

		if (target == "#delete_tab_pdService_version") {
			// 삭제하기 모드에서 숨길 버튼
			$("#pdservice_version_details_popup_div").addClass("hidden");
			$("#pdservice_update_div").addClass("hidden");

			// 삭제하기 모드에서 보여줄 버튼
			$("#pdservice_version_delete_div").removeClass("hidden");

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
		} else if (target == "#edit_tab_pdService_version") {
			// 편집하기 모드에서 숨길 버튼
			$("#pdservice_version_details_popup_div").addClass("hidden");
			$("#pdservice_version_delete_div").addClass("hidden");

			// 편집하기 모드에서 보여줄 버튼
			$(".pdservice-image-row").show();
			$(".file-delete-btn").show();
			$("#pdservice_update_div").removeClass("hidden");

		} else {
			// 상세 모드에서 숨길 버튼
			$("#pdservice_update_div").addClass("hidden");
			$("#pdservice_version_delete_div").addClass("hidden");
			$(".pdservice-image-row").hide();
			$(".file-delete-btn").hide();

			// 상세 모드에서 보여줄 버튼
			$("#pdservice_version_details_popup_div").removeClass("hidden");

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
	console.log("[ pdServiceVersion :: init_detail_tab ] :: 디테일 탭으로 초기화");

	// 데이터 테이블 열 클릭 시, 상세보기 tab을 기본값으로 세팅.
	$('div.widget-content.clearfix div.side-button').addClass('hidden');
	$('#pdservice_version_details_popup_div').removeClass('hidden');
	$('ul.nav-tabs li a').removeClass('active');
	$('div.tab-content .tab-pane').removeClass('active');
	$('div.tab-content .tab-pane').removeClass('show');
	$('#detail_nav_pdService').addClass('active');
	$('#detail_tab_pdService_version').addClass('active');
	$('#detail_tab_pdService_version').addClass('show');
}

///////////////////////////////
// 모달 팝업 띄울 때, UI 일부 수정되도록
////////////////////////////////
function modalPopup(popupName) {
	console.log(" [ pdService :: modalPopup ] :: popupName -> " + popupName);

	if (popupName === "modal_popup_new") {
		console.log(popupName + " 신규 버전 등록 팝업");
		//modal_popup_readOnly = 새 창으로 제품(서비스 보기)
		modalPopupDataBindingClear();
		$("#regist_pdservice_version").removeClass("hidden");
		$("#popup_view_pdservice_name").attr("disabled", true);

		$("#detail_pdService_version_modal_title").text("제품(서비스) 신규 버전 등록 팝업");
		$("#detail_pdService_version_modal_sub").text("선택한 제품(서비스)에 버전을 등록합니다.");
		$("#extendupdate_pdservice_version").addClass("hidden");
		$("#new_pdservice_save").removeClass("hidden");
	}
	else if (popupName === "modal_popup_readonly") {
		//modal_popup_readOnly = 새 창으로 제품(서비스 보기)
		$("#popup_view_pdservice_name").attr("disabled",true);
		console.log(popupName + " 제품 내용 보기 팝업");

		$("#detail_pdService_version_modal_title").text("제품(서비스) 버전 확인 팝업");
		$("#detail_pdService_version_modal_sub").text("새 창으로 제품(서비스)의 버전 정보를 확인합니다.");
		$("#extendupdate_pdservice_version").addClass("hidden");
		$("#new_pdservice_save").addClass("hidden");

		modalPopupDataBinding(true);
	}
	else { //팝업 창으로 편집하기
		console.log(popupName + " 제품 수정 팝업");
		$("#popup_view_pdservice_name").attr("disabled",true);

		$("#detail_pdService_version_modal_title").text(" 제품(서비스) 버전 변경 팝업");
		$("#detail_pdService_version_modal_sub").text("A-RMS에 제품(서비스)의 정보를 수정합니다.");
		$("#new_pdservice_save").addClass("hidden");
		$("#extendupdate_pdservice_version").removeClass("hidden");

		// 데이터 셋팅
		modalPopupDataBinding(false);
	}
}

function modalPopupDataBindingClear() {
	$("#popup_view_pdservice_version").val("");

	$("#popup_view_pdservice_version_start_date").val("");
	$("#popup_view_pdservice_version_end_date").val("");

	CKEDITOR.instances.modal_editor.setData("버전의 기획서 및 Version Charter 의 내용을 기록합니다.");
}

function modalPopupDataBinding(isReadOnly) {
	/*$("#detail_pdService_version_modal_title").text(" 신규 제품(서비스) 수정 팝업");
    $("#detail_pdService_version_modal_sub").text("A-RMS에 신규 제품(서비스)의 정보를 수정합니다.");*/
	if (isReadOnly) {
		$("#regist_pdservice_version").addClass("hidden");
		$("#extendupdate_pdservice_version").addClass("hidden");
		$("#new_pdservice_save").removeClass("hidden");
	}
	else {
		$("#regist_pdservice_version").addClass("hidden");
		$("#new_pdservice_save").addClass("hidden");
		$("#extendupdate_pdservice_version").removeClass("hidden");
	}

	// 데이터 셋팅
	var selectedId = $("#pdservice_datatable").DataTable().rows(".selected").data()[0].c_id;
	console.log("selectedId →" + selectedId);
	// 제품(서비스) 이름
	$("#popup_view_pdservice_name").val($("#detailview_pdservice_name").val());
	$("#popup_view_pdservice_version").val($("#detailview_pdservice_version").val());

	let start_date =  formatDate(getValidDate($("#detailview_pdservice_version_start_date").val()));
	let end_date =  formatDate(getValidDate($("#detailview_pdservice_version_end_date").val()));

	$("#popup_view_pdservice_version_start_date").val(start_date);
	$("#popup_view_pdservice_version_end_date").val(end_date);

	var editorData = CKEDITOR.instances.detailview_pdservice_version_contents.getData();
	console.log(editorData);
	CKEDITOR.instances.modal_editor.setData(editorData);
	CKEDITOR.instances.modal_editor.setReadOnly(isReadOnly);
}

////////////////////////////////////////////////////////////////////////////////////////
// 신규 버전 등록 버튼
////////////////////////////////////////////////////////////////////////////////////////
function save_btn_click() {
	$("#regist_pdservice_version").click(function () {

		const cTitle = $("#popup_view_pdservice_name").val();
		const cVersion = $("#popup_view_pdservice_version").val();

		const startDate = new Date($("#popup_view_pdservice_version_start_date").val());
		const endDate = new Date($("#popup_view_pdservice_version_end_date").val());

		if (startDate && endDate && startDate > endDate) {
			alert("The end date must be the same or after the start date.");
			$("#popup_view_pdservice_version_end_date").focus();
			return false;
		}

		var send_data = {
			c_id: selectId,
			pdServiceVersionEntities: [
				{
					ref:2,
					c_type: 'default',
					c_title: cVersion,
					c_pds_version_contents: CKEDITOR.instances.modal_editor.getData(),
					c_pds_version_start_date: startDate,
					c_pds_version_end_date: endDate
				}
			]
		};

		$.ajax({
			url: "/auth-user/api/arms/pdService/addVersionToNode.do",
			type: "POST",
			contentType : 'application/json; charset=utf-8',
			data: JSON.stringify(send_data),
			statusCode: {
				200: function () {
					//모달 팝업 끝내고
					jSuccess("데이터가 저장되었습니다.");
					$("#close_version").trigger("click");
					//버전 데이터 재 로드
					dataLoad(selectId, selectName);
				}
			}
		});

	});
}

////////////////////////////////////////////////////////////////////////////////////////
// 버전 변경 버튼
////////////////////////////////////////////////////////////////////////////////////////
function update_btn_click() {
	$("#pdservice_version_update").click(function () {

		const version_titile = $("#select_version").text();
		if (!confirm(version_titile +" 버전을 변경하시겠습니까?")) {
			return;
		}

		var send_data = {
			c_id: selectVersion,
			c_title: $("#editview_pdservice_version").val(),
			c_pds_version_contents: CKEDITOR.instances.editview_pdservice_version_contents.getData(),
			c_pds_version_start_date: $("#editview_pdservice_version_start_date").val(),
			c_pds_version_end_date: $("#editview_pdservice_version_end_date").val()
		};

		$.ajax({
			url: "/auth-user/api/arms/pdService/updateVersionToNode.do?pdservice_link=" + selectId,
			type: "put",
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify(send_data),
			statusCode: {
				200: function () {
					console.log("성공!");
					jSuccess("데이터가 변경되었습니다.");
					//모달 팝업 끝내고
					$("#close_version").trigger("click");
					//버전 데이터 재 로드
					dataLoad(selectId, selectName);
				}
			}
		});
	});
}


////////////////////////////////////////////////////////////////////////////////////////
// 버전 팝업 변경 버튼
////////////////////////////////////////////////////////////////////////////////////////
function modalPopupUpdate_btn_click() {
	$("#extendupdate_pdservice_version").click(function () {

		var send_data = {
			c_id: selectVersion,
			c_title: $("#popup_view_pdservice_version").val(),
			c_pds_version_contents: CKEDITOR.instances.modal_editor.getData(),
			c_pds_version_start_date: $("#popup_view_pdservice_version_start_date").val(),
			c_pds_version_end_date: $("#popup_view_pdservice_version_end_date").val()
		};

		$.ajax({
			url: "/auth-user/api/arms/pdService/updateVersionToNode.do?pdservice_link=" + selectId,
			type: "put",
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify(send_data),
			statusCode: {
				200: function () {
					console.log("성공!");
					jSuccess("데이터가 변경되었습니다.");
					//모달 팝업 끝내고
					$("#close_version").trigger("click");
					//버전 데이터 재 로드
					dataLoad(selectId, selectName);
					detailview_clear();
				}
			}
		});
	});
}

////////////////////////////////////////////////////////////////////////////////////////
// 버전 삭제 버튼
////////////////////////////////////////////////////////////////////////////////////////
function delete_btn_click() {
	$("#delete_pdservice_version").click(function () {
		console.log("delete btn");

		const version_titile = $("#select_version").text();

		if (!confirm(version_titile +" 버전을 삭제하시겠습니까?")) {
			return;
		}

		$.ajax({
			url: "/auth-user/api/arms/pdService/removeVersion.do",
			type: "DELETE",
			data: {
				pdservice_c_id: selectId,
				version_c_id: selectVersion
			},
			statusCode: {
				200: function () {
					console.log("삭제 성공!");
					jError(version_titile + " 버전이 삭제되었습니다.");

					//모달 팝업 끝내고
					$("#close_version").trigger("click");
					//버전 데이터 재 로드
					dataLoad(selectId, selectName);

					init_detail_tab();
					$("#select_version").text("선택되지 않음");
					detailview_clear();
				}
			}
		});
	});
}

////////////////////////////////////////////////////////////////////////////////////////
//버전 리스트를 재로드하는 함수 ( 버전 추가, 갱신, 삭제 시 호출 )
////////////////////////////////////////////////////////////////////////////////////////
function dataLoad(getSelectedText, selectedText) {
	// ajax 처리 후 에디터 바인딩.
	console.log(" [ pdServiceVersion :: dataLoad ] :: getSelectedID → " + getSelectedText);
	console.log(" [ pdServiceVersion :: dataLoad ] :: selectedText → " + selectedText);

	$.ajax("/auth-user/api/arms/pdService/getNodeWithVersionOrderByCidDesc.do?c_id=" + getSelectedText).done(function (json) {
		console.log(" [ pdServiceVersion :: dataLoad ] :: success → ", json);
		$("#version_accordion").jsonMenu("set", json.pdServiceVersionEntities, { speed: 5000 });
		//version text setting

		var selectedHtml = ``;

		$(".list-group-item").html(selectedHtml);

		$("#select_PdService").text(selectedText); // sender 이름 바인딩

		if( !isEmpty(json.pdServiceVersionEntities) ){
			// 상세보기
			selectVersion = json.pdServiceVersionEntities[0].c_id;
			$("#detailview_pdservice_name").val(selectName);
			$("#editview_pdservice_name").val(selectName);

			// $("#pdservice_name").val(selectedText);

			// $("#version_start_date").val(json.pdServiceVersionEntities[0].c_start_date);
			// $("#version_end_date").val(json.pdServiceVersionEntities[0].c_end_date);

			// $("#version_contents").html(json.pdServiceVersionEntities[0].c_contents);

/*			// 상세보기 편집하기
			$("#input_pdservice_name").val(selectedText);
			$("#input_pdservice_version").val(json.pdServiceVersionEntities[0].c_title);

			$("#input_pdservice_start_date").datetimepicker({ value: json.pdServiceVersionEntities[0].c_start_date + " 09:00", step: 10 , theme:'dark'});
			$("#input_pdservice_end_date").datetimepicker({ value: json.pdServiceVersionEntities[0].c_end_date + " 18:00", step: 10 , theme:'dark'});

			//편집하기 팝업
			$("#popup_view_pdservice_name").val(selectedText);
			$("#popup_view_pdservice_version").val(json.pdServiceVersionEntities[0].c_title);
			$("#popup_view_pdservice_version_start_date").datetimepicker({ value: json.pdServiceVersionEntities[0].c_start_date + " 09:00", step: 10 , theme:'dark'});
			$("#popup_view_pdservice_version_end_date").datetimepicker({ value: json.pdServiceVersionEntities[0].c_end_date + " 18:00", step: 10 , theme:'dark'});*/
		}
	});
}

function init_versionList() {
	var menu;
	$.fn.jsonMenu = function (action, items, options) {
		$(this).addClass("json-menu");
		if (action == "add") {
			menu.body.push(items);
			versionDraw($(this), menu);
		} else if (action == "set") {
			menu = items;
			// $("#select_Version").text(items[0].c_title);  // 로드시 첫번째 버전
			versionDraw($(this), menu);
		}
		return this;
	};
}

////////////////////////////////////////////////////////////////////////////////////////
//version list html 삽입
////////////////////////////////////////////////////////////////////////////////////////
function versionDraw(main, menu) {
	main.html("");

	var data = `
				<div class="gradient_bottom_border" style="width: 100%; height: 2px; margin-bottom: 10px;"></div>`;

	for (var i = 0; i < menu.length; i++) {
		if (i == 0) {
			data += `
			   <div class="panel">
				   <div class="panel-heading">
					   <a class="accordion-toggle collapsed"
					   			data-toggle="collapse"
					   			name="versionLink_List"
					   			style="color: #313131; text-decoration: none; cursor: pointer;  "
					   			onclick="versionClick(this, ${menu[i].c_id});
					   			return false;">
						   ${menu[i].c_title}
					   </a>
				   </div>
			   </div>`;
		} else {
			data += `
			   <div class="panel">
				   <div class="panel-heading">
					   <a class="accordion-toggle collapsed"
					   			data-toggle="collapse"
					   			name="versionLink_List"
					   			style="color: #313131; text-decoration: none; cursor: pointer;"
					   			onclick="versionClick(this, ${menu[i].c_id});
					   			return false;">
						   ${menu[i].c_title}
					   </a>
				   </div>
			   </div>`;
		}
	}

	main.html(data);
}

////////////////////////////////////////////////////////////////////////////////////////
//버전 클릭할 때 동작하는 함수
//1. 상세보기 데이터 바인딩
//2. 편집하기 데이터 바인딩
////////////////////////////////////////////////////////////////////////////////////////
function versionClick(element, c_id) {
	console.log("versionClick:: c_id  -> ", c_id);
    init_detail_tab();

	$("a[name='versionLink_List']").each(function () {
		this.style.background = "";
	});
	background: ;
	element.style.background = "rgba(78, 115, 223, 0.20)";
	// element.style.background = "rgba(229, 96, 59, 0.3)";

	selectVersion = c_id;

	$.ajax({
		url: "/auth-user/api/arms/pdServiceVersion/getNode.do", // 클라이언트가 HTTP 요청을 보낼 서버의 URL 주소
		data: { c_id: c_id }, // HTTP 요청과 함께 서버로 보낼 데이터
		method: "GET", // HTTP 요청 메소드(GET, POST 등)
		dataType: "json" // 서버에서 보내줄 데이터의 타입
	})
    // HTTP 요청이 성공하면 요청한 데이터가 done() 메소드로 전달됨.
    .done(function (json) {
        console.log(" → " + json.c_pds_version_contents);
        console.log(json);

        // sender 데이터 바인딩 및 선택 색상 표기
        $("#select_version").text(json.c_title);

        detailview_version_data_binding(json);
        editview_version_data_binding(json);

        CKEDITOR.instances.detailview_pdservice_version_contents.setData(json.c_pds_version_contents);
        CKEDITOR.instances.detailview_pdservice_version_contents.setReadOnly(true);

        CKEDITOR.instances.editview_pdservice_version_contents.setData(json.c_pds_version_contents);
        CKEDITOR.instances.editview_pdservice_version_contents.setReadOnly(false);

        $("#input_pdservice_start_date").datetimepicker({ value: json.c_pds_version_start_date + " 09:00", step: 10 , theme:'dark'});
        $("#input_pdservice_end_date").datetimepicker({ value: json.c_pds_version_end_date + " 18:00", step: 10 , theme:'dark'});
        $("#btn_enabled_date").datetimepicker({ value: json.c_pds_version_start_date + " 09:00", step: 10 , theme:'dark'});
        $("#btn_end_date").datetimepicker({ value: json.c_pds_version_end_date + " 18:00", step: 10 , theme:'dark'});

    })
    // HTTP 요청이 실패하면 오류와 상태에 관한 정보가 fail() 메소드로 전달됨.
    .fail(function (xhr, status, errorThrown) {
        console.log(xhr + status + errorThrown);
    })

    .always(function (xhr, status) {
        $("#text").html("요청이 완료되었습니다!");
        console.log(xhr + status);
    });
}

function detailview_version_data_binding(pdServiceVersionData) {
    $("#pdservice_name").text($("#pdservice_datatable").DataTable().rows(".selected").data()[0].c_title);

    $("#detailview_pdservice_version").val(pdServiceVersionData.c_title);

	let start_date =  formatDate(getValidDate(pdServiceVersionData.c_pds_version_start_date));
	let end_date =  formatDate(getValidDate(pdServiceVersionData.c_pds_version_end_date));

    $("#detailview_pdservice_version_start_date").val(start_date);
    $("#detailview_pdservice_version_end_date").val(end_date);
    CKEDITOR.instances.detailview_pdservice_version_contents.setData(pdServiceVersionData.c_pds_version_contents);
    CKEDITOR.instances.detailview_pdservice_version_contents.setReadOnly(true);
}

function editview_version_data_binding(pdServiceVersionData) {
    $("#pdservice_name").text($("#pdservice_datatable").DataTable().rows(".selected").data()[0].c_title);

    $("#editview_pdservice_version").val(pdServiceVersionData.c_title);

	let start_date =  formatDate(getValidDate(pdServiceVersionData.c_pds_version_start_date));
	let end_date =  formatDate(getValidDate(pdServiceVersionData.c_pds_version_end_date));

    $("#editview_pdservice_version_start_date").val(start_date);
    $("#editview_pdservice_version_end_date").val(end_date);
    CKEDITOR.instances.editview_pdservice_version_contents.setData(pdServiceVersionData.c_pds_version_contents);
    CKEDITOR.instances.editview_pdservice_version_contents.setReadOnly(false);
}

function detailview_clear() {
	$("#pdservice_name").text("");

	$("#detailview_pdservice_version").val("");
	$("#detailview_pdservice_version_start_date").val("");
	$("#detailview_pdservice_version_end_date").val("");
	CKEDITOR.instances.detailview_pdservice_version_contents.setData("버전의 기획서 및 Version Charter 의 내용을 기록합니다.");
	CKEDITOR.instances.detailview_pdservice_version_contents.setReadOnly(false);

	$("#editview_pdservice_name").text("");

	$("#editview_pdservice_version").val("");
	$("#editview_pdservice_version_start_date").val("");
	$("#editview_pdservice_version_end_date").val("");
	CKEDITOR.instances.editview_pdservice_version_contents.setData("버전의 기획서 및 Version Charter 의 내용을 기록합니다.");
	CKEDITOR.instances.editview_pdservice_version_contents.setReadOnly(false);
}

function getValidDate(input) {
	const timestamp = Date.parse(input);
	if (isNaN(timestamp)) {
		return new Date();
	}
	else {
		return input;
	}
}