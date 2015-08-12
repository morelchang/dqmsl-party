package morel.dqmsl.party;

import java.io.FileNotFoundException;
import java.io.IOException;

import morel.dqmsl.party.data.JsonFileMonsterDao;
import morel.dqmsl.party.model.Monster;


public class PartyLister {

	public static void main(String[] args) throws FileNotFoundException, IOException {
		JsonFileMonsterDao dao = new JsonFileMonsterDao();
		for (int no = 1; no <  10; no++) {
			Monster m = dao.getMonster(no);
			if (m == null) {
				continue;
			}
			System.out.println(m.toString());
		}
	}
}
