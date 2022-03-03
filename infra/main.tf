module "website" {
  source  = "./modules/site"
  prefix  = "em"
  site_id = "tax"
  custom_domains = [
    {
      domain = "taxph.jclarino.com"
      enable_ssl    = true
    }
  ]
}
