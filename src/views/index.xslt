<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="utf-8"/>
    <xsl:include href="config.xsl"/>
	<xsl:variable name="news.list" select="$data/table[@name='news.list']/item"/>
	<xsl:variable name="topImgList" select="$data/topImgList"/>
    <xsl:template match="/">
        <xsl:call-template name="docType-html5" />
        <html lang="zh-cn">
            <head>
                <title>日春茶业(官方网站) - 真品质不二价!</title>
                <meta charset="utf-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7, IE=9" />
                <meta Name="Keywords" content="日春,,茶基地,茶叶,茶具,茶食品,先祖,王仕让,铁观音" />
                <meta Name="Descritpion" content="日春股份公司是一家集茶基地建设，茶叶、茶具、茶食品开发、生产和销售为一体的专业化龙头企业，它的源头可追溯到乾隆年间（1736）日春先祖王仕让发现的铁观音" />
                <meta http-equiv="Content-Language" content="zh-CN" />
                <meta name="Author" content="心雨（QQ:55721736）" />
                <meta name="HomePage" content="http://www.fftoo.com/" />
                <meta name="Email" content="1000@intry.cn" />

                <meta name="apple-touch-fullscreen" content="YES" />
                <meta name="viewport" content="width=1024, minimum-scale=0.3, maximum-scale=2.0, user-scalable=yes" />

                <link href="{$template}/style/index.css" rel="stylesheet" type="text/css" />
                <xsl:call-template name="js-html5shim" />
                <xsl:call-template name="js-jquery" />
				<style type="text/css">
                    <!--@import url("style/index.css");-->
                    /**/
					body{
	background-color: ;
	background-image: url(/themes/2013/images/bg2016.jpg);
	background-repeat: repeat;
}
                </style>
				<script>document.imgPopIndex = "index";</script>
            </head>
            <body>
                <xsl:call-template name="header" />
                <xsl:call-template name="nav">
					<xsl:with-param name="action">index</xsl:with-param>
				</xsl:call-template>

                <nav id="nav1" style="display:none;">
                    <img id="index_03" src="{$template}/images/index_03.jpg" width="950" height="42" />
                </nav>
				<xsl:call-template name="pop" />
                <!--<figure id="ad_main">
                    <a href="#">
                        <img src="{$template}/images/ad_index.jpg" alt="可清心12000" title="可清心12000" />
                    </a>
                    <figcaption>可清心12000</figcaption>
                </figure>-->
				<section id="info">
					<xsl:for-each select="$topImgList/item[position() &lt;= 1]">
						<div class="info">
							<div class="info_img">
								<a href="{link}" target="_blank" title="{title}">
									<img src="{img}" />
									<span><xsl:value-of select="title" /></span>
								</a>
							</div>
							<ul class="info_list">
								<xsl:for-each select="$news.list[position() &lt;= 5]">
									<xsl:if test="position() mod 5 = 1">
										<li class="h1">
											<h1>
												<a href="{$appPath}/news/{id}/index.aspx" title="{title}" target="_blank">
												<xsl:value-of select="title" />
												</a>
											</h1>
										</li>
									</xsl:if>
									<xsl:if test="not(position() mod 5 = 1)">
										<li>
											<a href="{$appPath}/news/{id}/index.aspx" title="{title}" target="_blank">
												<xsl:value-of select="title" />
											</a>
										</li>
									</xsl:if>
								</xsl:for-each>
							</ul>
						</div>
					</xsl:for-each>
					<xsl:for-each select="$topImgList/item[position() = 2]">
						<div class="info" style="margin-left:2%;">
							<div class="info_img">
								<a href="{link}" target="_blank" title="{title}">
									<img src="{img}" />
									<span><xsl:value-of select="title" /></span>
								</a>
							</div>
							<ul class="info_list">
								<xsl:for-each select="$news.list[position() &gt; 5]">
									<xsl:if test="position() mod 5 = 1">
										<li class="h1">
											<h1>
												<a href="{$appPath}/news/{id}/index.aspx" title="{title}" target="_blank">
												<xsl:value-of select="title" />
												</a>
											</h1>
										</li>
									</xsl:if>
									<xsl:if test="not(position() mod 5 = 1)">
										<li>
											<a href="{$appPath}/news/{id}/index.aspx" title="{title}" target="_blank">
												<xsl:value-of select="title" />
											</a>
										</li>
									</xsl:if>
								</xsl:for-each>
							</ul>
						</div>
					</xsl:for-each>
				</section>
                <nav id="link">
                    <ul>
                        <li>
                            <a href="/news/list.aspx">
                                <img src="{$template}/images/link_1.jpg" alt="新闻动态" width="230" height="150" title="新闻动态" />
                                <span>新闻动态</span>
                            </a>
                        </li>
                        <li>
                            <a href="/mall.aspx">
                                <img src="{$template}/images/link_2.jpg" alt="产品导航" width="230" height="150" title="在线商城" />
                                <span>产品导航</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <img src="{$template}/images/link_3.jpg" alt="日春视界" width="230" height="150" title="日春视界" />
                                <span>日春视界</span>
                            </a>
                        </li>
                        <li class="e">
                            <a href="/shop/list.aspx">
                                <img src="{$template}/images/link_4.jpg" alt="直营网络" width="230" height="150" title="直营网络" />
                                <span>直营网络</span>
                            </a>
                        </li>
                    </ul>
                </nav>

                <hr class="hr" />
                <xsl:call-template name="footer" />
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>