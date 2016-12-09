###########################################################################
# $Id: d2ce4d22825a50197548f2100c49810ea86a0616 $                 #
#                                                                         #
#  schema.sql                       rlm_sql - FreeRADIUS SQL Module       #
#                                                                         #
#     Database schema for MySQL rlm_sql module                            #
#                                                                         #
#     To load:                                                            #
#         mysql -uroot -prootpass radius < schema.sql                     #
#                                                                         #
#                                   Mike Machado <mike@innercite.com>     #
# Edited by Krzysztof Grobelak Nov 11 2016                                #
# Enet OSS/BSS project                                                    #
#                                                                         #
# 1. Added ipv4_pool_name, ipv6_dp_pool_name, ipv6_nt_pool_name to        #
#    radcheck table.                                                      #
###########################################################################
#
# Table structure for table 'radacct'
#
CREATE TABLE radacct (
  radacctid bigint(21) NOT NULL auto_increment,
  acctsessionid varchar(64) NOT NULL default '',
  acctuniqueid varchar(32) NOT NULL default '',
  username varchar(64) NOT NULL default '',
  groupname varchar(64) NOT NULL default '',
  realm varchar(64) default '',
  nasipaddress varchar(15) NOT NULL default '',
  nasportid varchar(50) default NULL,
  nasporttype varchar(32) default NULL,
  acctstarttime datetime NULL default NULL,
  acctupdatetime datetime NULL default NULL,
  acctstoptime datetime NULL default NULL,
  acctinterval int(12) default NULL,
  acctsessiontime int(12) unsigned default NULL,
  acctauthentic varchar(32) default NULL,
  connectinfo_start varchar(50) default NULL,
  connectinfo_stop varchar(50) default NULL,
  acctinputoctets bigint(20) default NULL,
  acctoutputoctets bigint(20) default NULL,
  calledstationid varchar(50) NOT NULL default '',
  callingstationid varchar(50) NOT NULL default '',
  acctterminatecause varchar(32) NOT NULL default '',
  servicetype varchar(32) default NULL,
  framedprotocol varchar(32) default NULL,
  framedipaddress varchar(15) NOT NULL default '',
  PRIMARY KEY (radacctid),
  UNIQUE KEY acctuniqueid (acctuniqueid),
  KEY username (username),
  KEY framedipaddress (framedipaddress),
  KEY acctsessionid (acctsessionid),
  KEY acctsessiontime (acctsessiontime),
  KEY acctstarttime (acctstarttime),
  KEY acctinterval (acctinterval),
  KEY acctstoptime (acctstoptime),
  KEY nasipaddress (nasipaddress),
  INDEX bulk_close (acctstoptime, nasipaddress, acctstarttime)
) ENGINE = INNODB;

#
# Table structure for table 'radcheck'
#

CREATE TABLE radcheck (
  id int(11) unsigned NOT NULL auto_increment,
  username varchar(64) NOT NULL default '',
  attribute varchar(64)  NOT NULL default '',
  op char(2) NOT NULL DEFAULT '==',
  value varchar(253) NOT NULL default '',
  ipv4_pool_name varchar(253) NOT NULL default '',
  ipv6_dp_pool_name varchar(253) NOT NULL default '',
  ipv6_nt_pool_name varchar(253) NOT NULL default '',
  PRIMARY KEY  (id),
  KEY username (username(32))
);

#
# Table structure for table 'radgroupcheck'
#

CREATE TABLE radgroupcheck (
  id int(11) unsigned NOT NULL auto_increment,
  groupname varchar(64) NOT NULL default '',
  attribute varchar(64)  NOT NULL default '',
  op char(2) NOT NULL DEFAULT '==',
  value varchar(253)  NOT NULL default '',
  PRIMARY KEY  (id),
  KEY groupname (groupname(32))
);

#
# Table structure for table 'radgroupreply'
#

CREATE TABLE radgroupreply (
  id int(11) unsigned NOT NULL auto_increment,
  groupname varchar(64) NOT NULL default '',
  attribute varchar(64)  NOT NULL default '',
  op char(2) NOT NULL DEFAULT '=',
  value varchar(253)  NOT NULL default '',
  PRIMARY KEY  (id),
  KEY groupname (groupname(32))
);

#
# Table structure for table 'radreply'
#

#
# Table structure for table 'radreply'
#

CREATE TABLE radreply (
  id int(11) unsigned NOT NULL auto_increment,
  username varchar(64) NOT NULL default '',
  attribute varchar(64) NOT NULL default '',
  op char(2) NOT NULL DEFAULT '=',
  value varchar(253) NOT NULL default '',
  PRIMARY KEY  (id),
  KEY username (username(32))
);


#
# Table structure for table 'radusergroup'
#

CREATE TABLE radusergroup (
  username varchar(64) NOT NULL default '',
  groupname varchar(64) NOT NULL default '',
  priority int(11) NOT NULL default '1',
  KEY username (username(32))
);

#
# Table structure for table 'radpostauth'
#
CREATE TABLE radpostauth (
  id int(11) NOT NULL auto_increment,
  username varchar(64) NOT NULL default '',
  pass varchar(64) NOT NULL default '',
  reply varchar(32) NOT NULL default '',
  authdate timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY  (id)
) ENGINE = INNODB;

#
# Table structure for table 'nas'
#
CREATE TABLE nas (
  id int(10) NOT NULL auto_increment,
  nasname varchar(128) NOT NULL,
  shortname varchar(32),
  type varchar(30) DEFAULT 'other',
  ports int(5),
  secret varchar(60) DEFAULT 'secret' NOT NULL,
  server varchar(64),
  community varchar(50),
  description varchar(200) DEFAULT 'RADIUS Client',
  PRIMARY KEY (id),
  KEY nasname (nasname)
);

# Edited by Krzysztof Grobelak Nov 11 2016
#
# 1. Changed the varchar size to accomodate IPv6
#
# Table structure for table 'radippool'
#
CREATE TABLE radippool (
  id                    int(11) unsigned NOT NULL auto_increment,
  pool_name             varchar(30) NOT NULL,
  framedipaddress       varchar(39) NOT NULL default '',
  nasipaddress          varchar(39) NOT NULL default '',
  calledstationid       VARCHAR(30) NOT NULL,
  callingstationid      VARCHAR(30) NOT NULL,
  expiry_time           DATETIME NULL default NULL,
  username              varchar(64) NOT NULL default '',
  pool_key              varchar(30) NOT NULL,
  PRIMARY KEY (id),
  KEY radippool_poolname_expire (pool_name, expiry_time),
  KEY framedipaddress (framedipaddress),
  KEY radippool_nasip_poolkey_ipaddress (nasipaddress, pool_key, framedipaddress)
) ENGINE=InnoDB;


