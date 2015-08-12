package morel.dqmsl.party.model;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class Monbie {

	private static final BigDecimal STAR_DIVIDE = new BigDecimal(50);

	private int star1(int value, int fusion) {
		BigDecimal base = new BigDecimal(value);
		BigDecimal target = new BigDecimal(fusion);
		return base.divide(STAR_DIVIDE, RoundingMode.CEILING).add(target.divide(STAR_DIVIDE, RoundingMode.CEILING)).intValue(); 
	}

	private Monster monster;
	private int star;
	
	// skills

	// weapon

	public Monbie(Monster monster) {
		this.monster = monster;
	}
	
	public int getStar() {
		return star;
	}

	public void setStar(int star) {
		this.star = star;
	}
	
	public int getHp() {
		return starup(this.monster.getHp(), this.star);
	}

	public int getMp() {
		return starup(this.monster.getMp(), this.star);
	}
	
	public int getOffense() {
		return starup(this.monster.getOffense(), this.star);
	}
	
	public int getDefense() {
		return starup(this.monster.getDefense(), this.star);
	}
	
	public int getDexterity() {
		return starup(this.monster.getDexterity(), this.star);
	}
	
	public int getIntelligent() {
		return starup(this.monster.getIntelligent(), this.star);
	}
	
	private int starup(int value, int star) {
		int result = value;
		if (star <= 0) {
			return result;
		}
		
		for (int i = 0; i < star; i++) {
			int star1 = star1(result, value);
			result = result + star1;
		}
		return result;
	}
	
	@Override
	public String toString() {
		return "name:" + this.monster.getName() + "\n" +
				" star:" + this.getStar() + "\n" +
				" hp:" + this.getHp() + "\n" +
				" mp:" + this.getMp() + "\n" +
				" off:" + this.getOffense() + "\n" +
				" def:" + this.getDefense() + "\n" +
				" dex:" + this.getDexterity() + "\n" +
				" int:" + this.getIntelligent() + "\n";
	}
	
}
