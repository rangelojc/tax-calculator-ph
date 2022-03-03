module "website" {
  source  = "./modules/site"
  prefix  = "em"
  site_id = "tax"
  custom_domains = [
    {
      domain = "tax.jclarino.com"
      enable_ssl    = false
    },
    {
      domain = "tax-calc.jclarino.com"
      enable_ssl    = true
    }
  ]
}
