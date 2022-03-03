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
      domain = "tax-calculator.jclarino.com"
      enable_ssl    = true
    },
    {
      domain = "tax-calc.jclarino.com"
      enable_ssl    = true
    }
  ]
}
