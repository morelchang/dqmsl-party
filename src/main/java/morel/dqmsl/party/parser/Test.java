package morel.dqmsl.party.parser;

import java.text.ParseException;

import morel.dqmsl.party.model.Monbie;
import morel.dqmsl.party.model.Monster;

public class Test {

	public static void main(String[] args) throws ParseException {
		Monster m = new Monster();
		m.setName("ヘルバオム");
		m.setHp(597);
		m.setMp(232);
		m.setOffense(431);
		m.setDefense(390);
		m.setDexterity(299);
		m.setIntelligent(345);
		
		Monbie mm = new Monbie(m);
		System.out.println(mm.toString());
		mm.setStar(1);
		System.out.println(mm.toString());
		mm.setStar(2);
		System.out.println(mm.toString());
		mm.setStar(3);
		System.out.println(mm.toString());
		mm.setStar(4);
		System.out.println(mm.toString());
	}
}
