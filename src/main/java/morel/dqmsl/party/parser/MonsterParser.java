package morel.dqmsl.party.parser;

import java.io.IOException;
import java.text.NumberFormat;
import java.text.ParseException;
import java.util.Iterator;
import java.util.Map;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import morel.dqmsl.party.data.JsonFileSkillDao;
import morel.dqmsl.party.model.Monster;
import morel.dqmsl.party.model.Monster.Resistance;
import morel.dqmsl.party.model.Monster.ResistanceReaction;
import morel.dqmsl.party.model.Monster.ResistanceType;
import morel.dqmsl.party.model.Skill;

import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class MonsterParser {

	public Monster parse(Document doc) throws IOException, ParseException {
		Monster m = new Monster();
		m.setIcon(doc.select("div.mbox > div.mboxh > img").get(0).attr("src"));
		m.setName(doc.select("div.mbox > div.mboxh > img").get(0).attr("alt"));
		m.setViewedNum(parseInt(doc.select("span.lhnum").text()));
		m.setLikeNum(parseInt(doc.select("span#lhnuml").text()));
		m.setDislikeNum(parseInt(doc.select("span#lhnumh").text()));
		m.setNo(parseInt(doc.select("div.mboxb > div > div > span.enclose3").get(0).textNodes().get(1).text()));
		m.setRank(parseRank(doc.select("div.mboxb > div > div > span.enclose3 span.rankSprite").attr("class")));
		m.setSystem(parseSystem(doc.select("div.mboxb > div > div > span.enclose3 a.linkTextF").get(1).attr("href")));
		m.setType(parseType(doc.select("div.mboxb > div > div > span.enclose3 a.linkTextF").get(2).attr("href")));
		m.setWeight(parseInt(doc.select("div.mboxb > div > div > span.enclose3 a.linkTextF").get(3).textNodes().get(1).text()));
		m.setMaxLevel(parseInt(doc.select("div.mboxb > div > div > span.enclose3").get(5).textNodes().get(1).text()));
		
		// attr
		m.setHp(parseInt(doc.select("span#hpid").text()));
		m.setMp(parseInt(doc.select("span#mpid").text()));
		m.setOffense(parseInt(doc.select("span#ofid").text()));
		m.setDefense(parseInt(doc.select("span#dfid").text()));
		m.setDexterity(parseInt(doc.select("span#dxid").text()));
		m.setIntelligent(parseInt(doc.select("span#eiid").text()));
		
		// resistance
		Elements resElems = doc.select("span.listHead2 > a");
		Elements resResult = doc.select("span.tisis + span");
		Iterator<Element> resResultIt = resResult.iterator();
		for (Iterator<Element> iterator = resElems.iterator(); iterator.hasNext();) {
			Element resHeaderElm = iterator.next();
			Element resResultElm = resResultIt.next();
			Resistance res = parseResistance(resHeaderElm, resResultElm);
			if (res == null) {
				continue;
			}
			
			m.addResistance(res);
		}
		
		// tokugi
		Map<String, Skill> skills = new TreeMap<>();
		Elements tkgElems = doc.select("#tokugiImageInfoImage~div span.tokugiSprite~a");
		for (Element e : tkgElems) {
			Matcher ma = Pattern.compile("&to=%2c(\\d+)&").matcher(e.attr("href"));
			if (!ma.find()) {
				throw new ParseException("failed to parse skill id from string:" + e.attr("href"), 0);
			}
			
			String skillId = ma.group(1);
			if (skillId == null) {
				System.out.println("failed to get skill id from node:" + e.toString());
				continue;
			}
			
			
			Skill skill = new JsonFileSkillDao().findSkill(skillId);
			skills.put(skillId, skill);
		}
		m.setSkills(skills);
		
		// TODO: tokugi for new-born
		// css selector "#tokugiImageInfoImage2~div span.tokugiSprite~a"
		return m;
	}
	
	private Resistance parseResistance(Element resHeaderElm, Element resResultElm) {
		ResistanceType resistanceType = parseResistanceType(resHeaderElm);
		ResistanceReaction resistanceReaction = parseResistanceReactione(resResultElm);
		if (resistanceReaction == null) {
			return null;
		}
		return new Resistance(resistanceType, resistanceReaction);
	}

	private ResistanceReaction parseResistanceReactione(Element e) {
		// next span of span.tisis, contains class="taiseiSprite tisiN", which N = 1~15
		String spanClass = e.attr("class");
		
		// match tisiN in end of class
		for (int no = 1; no <= 15; no++) {
			if (spanClass.matches(".* tisi" + no + "$")) {
				return ResistanceReaction.values()[no - 1];
			}
		}
		return null;
	}

	private ResistanceType parseResistanceType(Element e) {
		// href contains kind=N, for N from 1~15
		String href = e.attr("href");

		// matches kind=N in end of href
		for (int no = 1; no <= 15; no++) {
			if (href.matches(".*kind=" + no + "$")) {
				return ResistanceType.values()[no - 1];
			}
		}
		return null;
	}

	private Monster.System parseSystem(String value) {
		for (int no = 1; no <= 9; no++) {
			if (value.contains("system=" + no)) {
				return Monster.System.values()[no - 1];
			}
		}
		return null;
	}

	private Monster.Type parseType(String value) {
		for (int no = 1; no <= 7; no++) {
			if (value.contains("type=" + no)) {
				return Monster.Type.values()[no - 1];
			}
		}
		return null;
	}

	private Monster.Rank parseRank(String value) {
		for (int no = 1; no <= 8; no++) {
			if (value.contains("rank" + no)) {
				return Monster.Rank.values()[no - 1];
			}
		}
		return null;
	}

	private int parseInt(String value) throws ParseException {
		return NumberFormat.getInstance().parse(value).intValue();
	}
}
