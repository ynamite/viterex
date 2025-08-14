<?php ob_start(); ?>
<mjml>
  <mj-head>
        <mj-preview><?=rex::getServer();?></mj-preview>
	
        <mj-attributes>
          <mj-all font-family="Arial, sans-serif" />
        </mj-attributes>
		<mj-breakpoint width="730px" />
		<mj-style>
	      .bg-white table {
	        background-color: #ffffff !important;
	      }
	      
	        
		  @media (max-width:580px) { 
	        .sectionpadded  table:first-child > td:first-child  {
	          padding-left:20px !important;
	          padding-right:20px;
	        }
	      }
	      
	    </mj-style>
	    
	
	

  </mj-head>
  <mj-body background-color="#F4F4F4">
  
 	<mj-wrapper width="600px" background-color="#F4F4F4" padding="40px">
		<mj-wrapper padding="0" >
			
			<mj-section background-color="#fff" css-class="sectionpadded" padding="40px 40px 40px 40px">
		      <mj-column padding="0">
		        <mj-image width="254" padding="0" align="left" src="<?=rex_url::assets('theme/img/logo-vzf.png')?>" href="<?=rex_yrewrite::getCurrentDomain()?>" />

		      </mj-column>
		    </mj-section>
			
			REX_ARTICLE[]
			
			<mj-section padding="40px 0" css-class="sectionpadded"  background-color="#202020">
			    <mj-column>
			
				
					<mj-text align="left" 
							 font-weight="normal"
							 font-size="14px"
							 line-height="20px" 
							 color="#fff"
							 padding="0 40px">
							<b>{{address_firma}}<br />
							{{address_firma_zusatz}}</b><br />
							{{address_strasse}}<br />
							{{address_plz}} {{address_ort}}<br /><br />
							{{address_telefon_html}}<br>
							{{address_fax_html}}<br>
							{{address_e-mail_html}}<br>

					</mj-text>
					
			    </mj-column>
			</mj-section>
		
		</mj-wrapper>
 	</mj-container>
   
  </mj-body>
</mjml>
<?php 
	
	$mjml = ob_get_clean();

	if(isset($_GET['mjml']))	
		die($mjml);
		
	$user = '5db3a909-efbb-48e6-adee-50b88bbc0f22';
	$pwd = '49ca4f4f-11b1-4940-b3b1-b520725d519e';
	
	$mjmlClient = new mjmlClient($user, $pwd);
	
	
	$response = $mjmlClient->render($mjml);
	
	
	
	echo $response;

?>
