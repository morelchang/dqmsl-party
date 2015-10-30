package morel.dqmsl.party;

import java.io.IOException;
import java.util.Map;

import morel.dqmsl.party.parser.CharacteristcsParser;
import morel.dqmsl.party.parser.SkillParser;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

public class SkillFetcher {
	
	private Document doc;
	private SkillParser skillParser = new SkillParser();
	private CharacteristcsParser characteristcsParser = new CharacteristcsParser();;

	public Map<String, String> fetchSkills() throws IOException {
		Document doc = obtainDoc();

		if (doc.select("span.skillButton").size() <= 0) {
			// 404 not found
			return null;
		}
		
		return skillParser.parse(doc);
	}
	
	public Map<String, String> fetchCharacteristics() throws IOException {
		Document doc = obtainDoc();
		return characteristcsParser.parse(doc);
	}

	private Document obtainDoc() throws IOException {
		if (this.doc != null) {
			return this.doc;
		}
		
		Document doc = Jsoup
				.connect("http://dqmsl-search.net/measure/search")
				.userAgent(
						"Mozilla/5.0 (Windows; U; WindowsNT 5.1; en-US; rv1.8.1.6) Gecko/20070725 Firefox/2.0.0.6")
				.referrer("http://www.google.com").get();
		return doc;
	}
	
}
