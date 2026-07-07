export const Customers: Record<
  string,
  {
  name              : string;
  iic?              : string;
  accountNumber1    : string;
  accountNumber2?   : string;
  bankAccount       : string;
  uhidKSAM1?        : string;
  }
> = {
  VulnerableWeasley : {
  name              : "วัลเนอราเบิ้ล วีสลีย์",
  accountNumber1    : "ROBO2667433",
  bankAccount       : "",
  },
  HermioneGranger   : {
  name              : "เฮอร์ไมโอนี่ เกรนเจอร์",
  accountNumber1    : "FIN0171918",
  bankAccount       : "",
  },
  RonWeasley        : {
  name              : "รอน วีสลีย์",
  accountNumber1    : "FIN0171916",
  accountNumber2    : "ODI0171917",
  bankAccount       : "SCB - 5014207490",
  uhidKSAM1         : "",
  },
};
