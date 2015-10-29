package morel.dqmsl.party;

import java.io.IOException;
import java.util.Map;

import morel.dqmsl.party.data.JsonFileSkillDao;

public class SkillSync {

	public static void main(String[] args) throws IOException {
		SkillFetcher fetcher = new SkillFetcher();
		Map<String, String> skills = fetcher.fetch();
		JsonFileSkillDao dao = new JsonFileSkillDao();
		dao.saveSkill(skills);
	}
}
