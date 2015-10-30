package morel.dqmsl.party;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;

import morel.dqmsl.party.data.JsonFileMonsterDao;
import morel.dqmsl.party.model.Monster;

public class PartySync {

	public static void main(String[] args) throws IOException, ParseException {
		PartySync s = new PartySync();
		boolean overwrite = true;
		int max = 900;
		
		s.sync(1, max, overwrite);
	}

	private void sync(int start, int to, boolean overwrite) throws IOException {
		PartyFetcher pf = new PartyFetcher();
		JsonFileMonsterDao dao = new JsonFileMonsterDao();
		for (int no = start; no <= to; no++) {
			// skip monster persisted
			File source = new File("./data/monster-" + no + ".json");
			if (!overwrite && source.exists()) {
				System.out.println("skip exist no:" + no);
				continue;
			}
			
			// fetch monster
			Monster mm = null;
			try {
				mm = pf.fetch(no);
			} catch (Exception e) {
				System.out.println("fetch no:" + no + " failed:" + e.getMessage());
				e.printStackTrace();
				continue;
			}
			
			if (mm == null) {
				System.out.println("no:" + no + " not found");
				continue;
			}
			
			// save monster
			System.out.println("saving no:" + no);
			dao.saveMonster(mm);
		}
	}
}
